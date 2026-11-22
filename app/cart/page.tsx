"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import FeederArt from "@/components/FeederArt";
import {
  type AddOnId,
  type Cart,
  type CartItem,
  type ColourId,
  type SizeId,
  MAX_QTY,
  CART_EVENT,
  getCart,
  itemKey,
  itemUnitPrice,
  removeItem,
  setItemQty,
} from "@/lib/cart";
import { FREE_DELIVERY_THRESHOLD, formatINR, getAddOn, getColour, getSize } from "@/lib/products";

export default function CartPage() {
  const [cart, setCart] = useState<Cart>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setCart(getCart()), []);

  useEffect(() => {
    refresh();
    setReady(true);
    window.addEventListener(CART_EVENT, refresh);
    return () => window.removeEventListener(CART_EVENT, refresh);
  }, [refresh]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <p className="text-bark-soft">Loading your cart…</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-4 text-bark-soft max-w-md mx-auto">
          Your dog is waiting. Pick a size, pick a colour, and give them a
          puzzle that never runs out.
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

  const subtotal = cart.reduce((sum, item) => sum + itemUnitPrice(item) * item.qty, 0);
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Your cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <ul className="lg:col-span-2 space-y-5">
          {cart.map((item) => {
            const key = itemKey(item);
            const size = getSize(item.size as SizeId);
            const colour = getColour(item.colour as ColourId);
            const addOns = (item.addOns as AddOnId[]).map((id) => getAddOn(id));
            return (
              <li
                key={key}
                className="rounded-3xl border border-sand bg-parchment p-5 flex gap-5"
              >
                <div className="shrink-0 hidden sm:block">
                  <FeederArt
                    body={colour.swatch}
                    edge={colour.edge}
                    className="w-24 h-auto"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        Refill — {size.shortLabel}
                      </p>
                      <p className="text-sm text-bark-soft">
                        {colour.label}
                        {addOns.length > 0 && ` + ${addOns.map((a) => a.label).join(", ")}`}
                      </p>
                      <p className="mt-1 text-sm text-bark-soft">
                        {formatINR(itemUnitPrice(item))} each
                      </p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">
                      {formatINR(itemUnitPrice(item) * item.qty)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border-2 border-sand bg-cream">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${size.shortLabel} ${colour.label}`}
                        disabled={item.qty <= 1}
                        className="px-3 py-1.5 text-lg font-bold disabled:opacity-30"
                        onClick={() => {
                          setItemQty(key, item.qty - 1);
                          refresh();
                        }}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${size.shortLabel} ${colour.label}`}
                        disabled={item.qty >= MAX_QTY}
                        className="px-3 py-1.5 text-lg font-bold disabled:opacity-30"
                        onClick={() => {
                          setItemQty(key, item.qty + 1);
                          refresh();
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-ember-dark hover:text-ember underline underline-offset-4"
                      onClick={() => {
                        removeItem(key);
                        refresh();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="rounded-3xl bg-bark text-cream p-7 h-fit">
          <h2 className="font-display text-2xl font-bold">Order summary</h2>
          <div className="mt-5 space-y-2 text-sm text-cream/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className={freeDelivery ? "text-ember font-semibold" : ""}>
                {freeDelivery ? "FREE" : "Calculated at checkout"}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-cream/20 flex justify-between items-baseline">
            <span className="font-semibold">Total</span>
            <span className="font-display text-3xl font-bold">
              {formatINR(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-xs text-cream/60">Pay on delivery — no online payment.</p>
          <Link
            href="/checkout"
            className="mt-6 block text-center rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-cream/70 hover:text-ember transition-colors"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
