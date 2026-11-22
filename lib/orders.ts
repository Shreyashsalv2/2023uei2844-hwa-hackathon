import {
  ADD_ONS,
  COLOURS,
  SIZES,
  getAddOn,
  getColour,
  getSize,
  type ColourId,
  type SizeId,
} from "./products";
import { INDIAN_STATES } from "./india";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

export interface OrderItem {
  productId: "refill";
  size: string;
  colour: string;
  addOns: string[];
  qty: number;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: "pay-on-delivery";
  status: "confirmed";
}

export type ParseResult =
  | { ok: true; order: Omit<OrderRecord, "id" | "createdAt"> }
  | { ok: false; status: number; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^[1-9]\d{5}$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const MAX_ITEMS = 20;

export const VALID_VARIANTS: string[] = SIZES.flatMap((s) =>
  COLOURS.map((c) => `${s.id}-${c.id}`)
);

const VALID_ADD_ON_IDS = ADD_ONS.map((a) => a.id);

function resolveVariant(
  variant: string
): { size: SizeId; colour: ColourId } | null {
  const dash = variant.indexOf("-");
  if (dash === -1) return null;
  const sizeId = variant.slice(0, dash) as SizeId;
  const colourId = variant.slice(dash + 1) as ColourId;
  if (!SIZES.some((s) => s.id === sizeId)) return null;
  if (!COLOURS.some((c) => c.id === colourId)) return null;
  return { size: sizeId, colour: colourId };
}

export function generateOrderId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) {
    suffix += alphabet[byte % alphabet.length];
  }
  return `RFL-${suffix}`;
}

export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return PHONE_RE.test(digits) ? digits : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseOrderPayload(payload: unknown): ParseResult {
  if (!isRecord(payload)) {
    return { ok: false, status: 400, error: "Request body must be a JSON object." };
  }

  const { customer, items } = payload;

  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, status: 400, error: "Your cart is empty." };
  }
  if (items.length > MAX_ITEMS) {
    return { ok: false, status: 400, error: "Too many line items in one order." };
  }

  const parsedItems: OrderItem[] = [];
  for (const entry of items) {
    if (!isRecord(entry)) {
      return { ok: false, status: 400, error: "Each cart item must be an object." };
    }
    if (entry.productId !== "refill") {
      return { ok: false, status: 400, error: "Unknown product." };
    }

    let sizeId: SizeId;
    let colourId: ColourId;
    const variant = typeof entry.variant === "string" ? entry.variant : null;

    if (variant) {
      const resolved = resolveVariant(variant);
      if (!resolved) {
        return {
          ok: false,
          status: 400,
          error: `Unknown variant "${variant}". Valid variants: ${VALID_VARIANTS.join(", ")}.`,
        };
      }
      sizeId = resolved.size;
      colourId = resolved.colour;
    } else if (
      SIZES.some((s) => s.id === entry.size) &&
      COLOURS.some((c) => c.id === entry.colour)
    ) {
      sizeId = entry.size as SizeId;
      colourId = entry.colour as ColourId;
    } else {
      return {
        ok: false,
        status: 400,
        error: `Each item must include a "variant" (e.g. "small-medium-clay") or a valid "size" and "colour". Valid variants: ${VALID_VARIANTS.join(", ")}.`,
      };
    }

    const rawAddOns = entry["add-ons"] ?? entry.addOns ?? [];
    if (!Array.isArray(rawAddOns)) {
      return { ok: false, status: 400, error: "Add-ons must be a list." };
    }
    for (const addOnId of rawAddOns) {
      if (!VALID_ADD_ON_IDS.includes(addOnId as never)) {
        return {
          ok: false,
          status: 400,
          error: `Unknown add-on "${String(addOnId)}". Valid add-ons: ${VALID_ADD_ON_IDS.join(", ")}.`,
        };
      }
    }
    const addOns = [...new Set(rawAddOns as string[])];

    const qty = entry.quantity ?? entry.qty;
    if (qty === undefined || typeof qty !== "number" || Number.isNaN(qty)) {
      return { ok: false, status: 400, error: "Quantity must be a number." };
    }
    if (!Number.isInteger(qty)) {
      return { ok: false, status: 400, error: "Quantity must be a whole number." };
    }
    if (qty < 1 || qty > 10) {
      return { ok: false, status: 400, error: "Quantity must be between 1 and 10." };
    }

    const size = getSize(sizeId);
    const unitPrice = size.price + addOns.reduce((sum, id) => sum + getAddOn(id as never).price, 0);
    parsedItems.push({
      productId: "refill",
      size: size.id,
      colour: getColour(colourId).id,
      addOns,
      qty,
      unitPrice,
    });
  }

  if (!isRecord(customer)) {
    return { ok: false, status: 400, error: "Delivery details are missing." };
  }

  const name = cleanString(customer.name);
  if (name.length < 2 || name.length > 80) {
    return { ok: false, status: 400, error: "Please enter your full name." };
  }

  const email = cleanString(customer.email);
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return { ok: false, status: 400, error: "Please enter a valid email address." };
  }

  const phone = normalizePhone(customer.phone);
  if (!phone) {
    return {
      ok: false,
      status: 400,
      error: "Please enter a valid 10-digit Indian mobile number.",
    };
  }

  const address = cleanString(customer.address);
  if (address.length < 10 || address.length > 200) {
    return { ok: false, status: 400, error: "Please enter your full street address." };
  }

  const city = cleanString(customer.city);
  if (city.length < 2 || city.length > 60) {
    return { ok: false, status: 400, error: "Please enter your city." };
  }

  const state = cleanString(customer.state);
  if (!INDIAN_STATES.includes(state)) {
    return { ok: false, status: 400, error: "Please select a valid state." };
  }

  const pin = cleanString(customer.pin);
  if (!PIN_RE.test(pin)) {
    return { ok: false, status: 400, error: "Please enter a valid 6-digit PIN code." };
  }

  const subtotal = parsedItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const deliveryFee = 0;

  return {
    ok: true,
    order: {
      customer: { name, email, phone, address, city, state, pin },
      items: parsedItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      payment: "pay-on-delivery",
      status: "confirmed",
    },
  };
}
