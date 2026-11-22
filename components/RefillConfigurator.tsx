"use client";

import Link from "next/link";
import { useState } from "react";
import FeederArt from "@/components/FeederArt";
import {
  COLOURS,
  MAX_FREE_DELIVERY_NOTE,
  SIZES,
  SCENT_POD_PRICE,
  formatINR,
  getSize,
} from "@/lib/products";

import { addToCart, MAX_QTY } from "@/lib/cart";

export default function RefillConfigurator() {
  const [sizeId, setSizeId] = useState<"small-medium" | "large">("small-medium");
  const [colourId, setColourId] = useState<"clay" | "moss" | "sandstone">("clay");
  const [qty, setQty] = useState(1);
  const [scentPod, setScentPod] = useState(false);
  const [added, setAdded] = useState(false);

  const size = getSize(sizeId);
  const colour = COLOURS.find((c) => c.id === colourId)!;
  const unitPrice = size.price + (scentPod ? SCENT_POD_PRICE : 0);
  const total = unitPrice * qty;

  const handleAdd = () => {
    addToCart({
      productId: "refill",
      size: sizeId,
      colour: colourId,
      addOns: scentPod ? ["scent-pod"] : [],
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-3xl bg-parchment border border-sand p-8 flex items-center justify-center">
        <FeederArt
          body={colour.swatch}
          edge={colour.edge}
          className="w-full max-w-md h-auto"
        />
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-ember">
          {formatINR(size.price)} · Free delivery
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold">
          Refill — {size.shortLabel}
        </h1>
        <p className="mt-3 text-bark-soft leading-relaxed">
          A sealed hopper holds up to {size.hopperCapacity}. After every level
          your dog solves, the tray rotates and deals kibble into a brand-new
          pattern. Sessions run on your schedule — engagement all day, no
          overeating.
        </p>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-bark-soft">
            Size
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSizeId(s.id)}
                className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                  sizeId === s.id
                    ? "border-ember bg-parchment"
                    : "border-sand hover:border-bark/40"
                }`}
              >
                <span className="block font-semibold">{s.shortLabel}</span>
                <span className="block text-xs text-bark-soft mt-1">
                  {s.weightRange} · {formatINR(s.price)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-bark-soft">
            Colour — {colour.label}
          </p>
          <div className="mt-3 flex gap-3">
            {COLOURS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.label}
                title={`${c.label} — ${c.description}`}
                onClick={() => setColourId(c.id)}
                className={`h-11 w-11 rounded-full border-2 transition-transform ${
                  colourId === c.id
                    ? "border-ember scale-110"
                    : "border-sand hover:scale-105"
                }`}
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-bark-soft">
            Quantity
          </p>
          <div className="mt-3 inline-flex items-center rounded-full border-2 border-sand">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="px-4 py-2 text-lg font-bold disabled:opacity-30"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-10 text-center font-semibold">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="px-4 py-2 text-lg font-bold disabled:opacity-30"
              disabled={qty >= MAX_QTY}
              onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            >
              +
            </button>
          </div>
          <span className="ml-3 text-xs text-bark-soft">Max {MAX_QTY} per order</span>
        </div>

        <div className="mt-6">
          <label className="flex items-start gap-3 rounded-2xl border-2 border-sand p-4 cursor-pointer hover:border-bark/40 transition-colors">
            <input
              type="checkbox"
              checked={scentPod}
              onChange={(e) => setScentPod(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#d96f32]"
            />
            <span>
              <span className="font-semibold">
                Add the Scent Pod (+ {formatINR(SCENT_POD_PRICE)})
              </span>
              <span className="block text-sm text-bark-soft mt-1">
                A swap-in pod under the tray that holds a treat or familiar
                scent. Pulls your dog back to the puzzle between sessions.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-8 rounded-2xl bg-parchment border border-sand p-5">
          <div className="flex justify-between text-sm text-bark-soft">
            <span>
              {formatINR(size.price)}
              {scentPod ? ` + ${formatINR(SCENT_POD_PRICE)} Scent Pod` : ""} ×{" "}
              {qty}
            </span>
            <span>{formatINR(unitPrice)} each</span>
          </div>
          <div className="mt-2 flex justify-between items-baseline">
            <span className="font-semibold">Total</span>
            <span className="font-display text-3xl font-bold">
              {formatINR(total)}
            </span>
          </div>
          <p className="mt-1 text-xs text-moss-dark font-medium">
            {MAX_FREE_DELIVERY_NOTE}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors"
            >
              Add to cart
            </button>
            <Link
              href="/cart"
              className="flex-1 text-center rounded-full border-2 border-bark px-8 py-3 text-base font-semibold text-bark hover:bg-parchment transition-colors"
            >
              Go to cart
            </Link>
          </div>
          {added && (
            <p className="mt-3 text-sm font-semibold text-moss-dark">
              Added to your cart ✓
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
