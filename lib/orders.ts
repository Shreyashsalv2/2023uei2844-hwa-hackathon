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

export type FieldErrors = Record<string, string>;

export type ParseResult =
  | { ok: true; order: Omit<OrderRecord, "id" | "createdAt"> }
  | { ok: false; status: number; error: string; fields?: FieldErrors };

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
  for (const s of SIZES) {
    if (variant.startsWith(`${s.id}-`)) {
      const colourId = variant.slice(s.id.length + 1) as ColourId;
      if (COLOURS.some((c) => c.id === colourId)) {
        return { size: s.id, colour: colourId };
      }
    }
  }
  return null;
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
    return {
      ok: false,
      status: 400,
      error: "validation failed",
      fields: { body: "request body must be a JSON object" },
    };
  }

  const { customer, items } = payload;
  const fields: FieldErrors = {};
  const parsedItems: OrderItem[] = [];

  if (!Array.isArray(items) || items.length === 0) {
    fields["items"] = "cart is empty";
  } else if (items.length > MAX_ITEMS) {
    fields["items"] = "too many line items in one order";
  } else {
    items.forEach((entry, i) => {
      if (!isRecord(entry)) {
        fields[`items.${i}`] = "each cart item must be an object";
        return;
      }
      if (entry.productId !== "refill") {
        fields[`items.${i}.productId`] = "unknown product (only \"refill\" is sold)";
        return;
      }

      let sizeId: SizeId | null = null;
      let colourId: ColourId | null = null;
      const variant = typeof entry.variant === "string" ? entry.variant : null;

      if (variant) {
        const resolved = resolveVariant(variant);
        if (!resolved) {
          fields[`items.${i}.variant`] = `unknown variant "${variant}" (valid variants: ${VALID_VARIANTS.join(", ")})`;
        } else {
          sizeId = resolved.size;
          colourId = resolved.colour;
        }
      } else if (
        SIZES.some((s) => s.id === entry.size) &&
        COLOURS.some((c) => c.id === entry.colour)
      ) {
        sizeId = entry.size as SizeId;
        colourId = entry.colour as ColourId;
      } else {
        fields[`items.${i}.variant`] = `missing variant: each item needs a "variant" (e.g. "large-moss") or a valid "size" and "colour" (valid variants: ${VALID_VARIANTS.join(", ")})`;
      }

      const rawAddOns = entry["add-ons"] ?? entry.addOns ?? [];
      if (!Array.isArray(rawAddOns)) {
        fields[`items.${i}.add-ons`] = "add-ons must be a list";
      } else {
        for (const addOnId of rawAddOns) {
          if (!VALID_ADD_ON_IDS.includes(addOnId as never)) {
            fields[`items.${i}.add-ons`] = `unknown add-on "${String(addOnId)}" (valid add-ons: ${VALID_ADD_ON_IDS.join(", ")})`;
            break;
          }
        }
      }
      const addOns = Array.isArray(rawAddOns) ? [...new Set(rawAddOns as string[])] : [];

      const qty = entry.quantity ?? entry.qty;
      if (qty === undefined || typeof qty !== "number" || Number.isNaN(qty)) {
        fields[`items.${i}.quantity`] = "quantity must be a number";
      } else if (!Number.isInteger(qty)) {
        fields[`items.${i}.quantity`] = "quantity must be a whole number";
      } else if (qty < 1 || qty > 10) {
        fields[`items.${i}.quantity`] = "quantity must be between 1 and 10";
      }

      if (sizeId && colourId && fields[`items.${i}.quantity`] === undefined && fields[`items.${i}.add-ons`] === undefined) {
        const size = getSize(sizeId);
        const unitPrice = size.price + addOns.reduce((sum, id) => sum + getAddOn(id as never).price, 0);
        parsedItems.push({
          productId: "refill",
          size: size.id,
          colour: getColour(colourId).id,
          addOns,
          qty: qty as number,
          unitPrice,
        });
      }
    });
  }

  if (!isRecord(customer)) {
    fields["customer"] = "delivery details are missing";
  } else {
    const name = cleanString(customer.name);
    if (name.length < 2 || name.length > 80) {
      fields["customer.name"] = "enter your full name (2–80 characters)";
    }

    const email = cleanString(customer.email);
    if (!EMAIL_RE.test(email) || email.length > 120) {
      fields["customer.email"] = "invalid email";
    }

    const phone = normalizePhone(customer.phone);
    if (!phone) {
      fields["customer.phone"] = "invalid phone: use a 10-digit Indian mobile number starting with 6–9";
    }

    const address = cleanString(customer.address);
    if (address.length < 10 || address.length > 200) {
      fields["customer.address"] = "enter your full street address (10–200 characters)";
    }

    const city = cleanString(customer.city);
    if (city.length < 2 || city.length > 60) {
      fields["customer.city"] = "enter your city";
    }

    const state = cleanString(customer.state);
    if (!INDIAN_STATES.includes(state)) {
      fields["customer.state"] = "invalid state: choose one from the Indian states list";
    }

    const pin = cleanString(customer.pin);
    if (!PIN_RE.test(pin)) {
      fields["customer.pin"] = "invalid PIN: use a 6-digit PIN code";
    }
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, status: 400, error: "validation failed", fields };
  }

  const cust = customer as Record<string, unknown>;
  const subtotal = parsedItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const deliveryFee = 0;

  return {
    ok: true,
    order: {
      customer: {
        name: cleanString(cust.name),
        email: cleanString(cust.email),
        phone: normalizePhone(cust.phone) as string,
        address: cleanString(cust.address),
        city: cleanString(cust.city),
        state: cleanString(cust.state),
        pin: cleanString(cust.pin),
      },
      items: parsedItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      payment: "pay-on-delivery",
      status: "confirmed",
    },
  };
}
