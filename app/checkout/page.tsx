"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  type AddOnId,
  type Cart,
  type CartItem,
  type ColourId,
  type SizeId,
  CART_EVENT,
  cartSubtotal,
  clearCart,
  getCart,
  itemKey,
  itemUnitPrice,
} from "@/lib/cart";
import { FREE_DELIVERY_THRESHOLD, formatINR, getAddOn, getColour, getSize } from "@/lib/products";
import { INDIAN_STATES } from "@/lib/india";

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pin: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^[1-9]\d{5}$/;

function normalizePhone(raw: string): string {
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return digits;
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!/^[6-9]\d{9}$/.test(normalizePhone(form.phone))) {
    errors.phone = "Enter a 10-digit Indian mobile number starting with 6–9.";
  }
  if (form.address.trim().length < 10) {
    errors.address = "Please enter your complete street address (house, building, street).";
  }
  if (form.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }
  if (!INDIAN_STATES.includes(form.state)) {
    errors.state = "Please select your state.";
  }
  if (!PIN_RE.test(form.pin.trim())) {
    errors.pin = "Enter a valid 6-digit PIN code.";
  }
  return errors;
}

function fieldsFromServer(
  fields: Record<string, string> | undefined
): { fieldErrors: FieldErrors; other: string[] } {
  const fieldErrors: FieldErrors = {};
  const other: string[] = [];
  for (const [key, message] of Object.entries(fields ?? {})) {
    const dot = key.indexOf(".");
    const head = dot === -1 ? key : key.slice(0, dot);
    if (head === "customer" && dot !== -1) {
      const field = key.slice(dot + 1) as keyof FormState;
      if (field in EMPTY_FORM) {
        fieldErrors[field] = message;
        continue;
      }
    }
    other.push(`${key}: ${message}`);
  }
  return { fieldErrors, other };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>([]);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setCart(getCart());
    setReady(true);
    const sync = () => setCart(getCart());
    window.addEventListener(CART_EVENT, sync);
    return () => window.removeEventListener(CART_EVENT, sync);
  }, []);

  const set = (field: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const items = cart.map((item: CartItem) => ({
        productId: item.productId,
        size: item.size,
        colour: item.colour,
        addOns: item.addOns,
        qty: item.qty,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const { fieldErrors, other } = fieldsFromServer(data?.fields);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
          first?.focus();
        } else {
          setFormError(
            other.length > 0
              ? other.join(" · ")
              : data?.error ?? "Something went wrong placing your order. Please try again."
          );
        }
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order/${data.orderId}`);
    } catch {
      setFormError("Network error — could not reach the order service. Please try again.");
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <p className="text-bark-soft">Loading checkout…</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Nothing to check out</h1>
        <p className="mt-4 text-bark-soft">
          Your cart is empty — add a Refill first.
        </p>
        <Link
          href="/products/refill"
          className="mt-8 inline-block rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors"
        >
          Configure your Refill
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal();
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-3 space-y-8" noValidate>
          <section>
            <h2 className="font-display text-2xl font-bold">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="name"
                label="Full name"
                value={form.name}
                onChange={set("name")}
                autoComplete="name"
                error={errors.name}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email}
              />
              <Field
                id="phone"
                label="Mobile number"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(v) => set("phone")(v.replace(/[^\d+]/g, ""))}
                autoComplete="tel"
                placeholder="98765 43210"
                hint="10 digits, starting 6–9"
                error={errors.phone}
              />
              <Field
                id="state"
                label="State"
                type="select"
                value={form.state}
                onChange={set("state")}
                error={errors.state}
              />
              <Field
                id="city"
                label="City"
                value={form.city}
                onChange={set("city")}
                autoComplete="address-level2"
                error={errors.city}
              />
              <Field
                id="pin"
                label="PIN code"
                type="text"
                inputMode="numeric"
                value={form.pin}
                onChange={(v) => set("pin")(v.replace(/\D/g, "").slice(0, 6))}
                autoComplete="postal-code"
                placeholder="6 digits"
                error={errors.pin}
              />
              <div className="sm:col-span-2">
                <Field
                  id="address"
                  label="Street address"
                  type="textarea"
                  value={form.address}
                  onChange={set("address")}
                  autoComplete="street-address"
                  placeholder="House / flat, building, street, landmark"
                  error={errors.address}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">Payment</h2>
            <div className="mt-4 rounded-2xl border-2 border-moss bg-cream p-5">
              <p className="font-semibold text-moss-dark">
                Pay on Delivery
              </p>
              <p className="mt-1 text-sm text-bark-soft">
                Pay by cash or UPI when your Refill arrives at your door. No
                online payment needed, and free delivery is included.
              </p>
            </div>
          </section>

          {formError && (
            <p
              role="alert"
              className="rounded-xl border-2 border-ember-dark bg-parchment px-4 py-3 text-sm font-medium text-ember-dark"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto rounded-full bg-ember px-10 py-3.5 text-base font-semibold text-cream hover:bg-ember-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order — ${formatINR(subtotal)}`}
          </button>
          <p className="text-xs text-bark-soft">
            You can review everything before it ships — we&apos;ll call to
            confirm delivery time.
          </p>
        </form>

        <aside className="lg:col-span-2 rounded-3xl bg-bark text-cream p-7 h-fit">
          <h2 className="font-display text-2xl font-bold">Your order</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {cart.map((item) => {
              const size = getSize(item.size as SizeId);
              const colour = getColour(item.colour as ColourId);
              const addOns = (item.addOns as AddOnId[]).map((id) => getAddOn(id));
              return (
                <li key={itemKey(item)} className="flex justify-between gap-4">
                  <span className="text-cream/80">
                    {size.shortLabel} · {colour.label}
                    {addOns.length > 0 && ` + ${addOns.map((a) => a.label).join(", ")}`}
                    <span className="block text-cream/50">× {item.qty}</span>
                  </span>
                  <span className="whitespace-nowrap">
                    {formatINR(itemUnitPrice(item) * item.qty)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 pt-4 border-t border-cream/20 space-y-2 text-sm text-cream/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className={freeDelivery ? "text-ember font-semibold" : ""}>
                {freeDelivery ? "FREE" : "—"}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-cream/20 flex justify-between items-baseline">
            <span className="font-semibold">Total</span>
            <span className="font-display text-3xl font-bold">
              {formatINR(subtotal)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  hint,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "select" | "textarea";
  inputMode?: "numeric" | "tel" | "text";
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const inputClass = `mt-1.5 w-full rounded-xl border-2 bg-cream px-4 py-2.5 text-bark focus:outline-none ${
    error ? "border-ember-dark" : "border-sand focus:border-ember"
  }`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} <span className="text-ember">*</span>
      </label>
      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClass}
        >
          <option value="" disabled>
            Select your state
          </option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClass}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-ember-dark">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-bark-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
