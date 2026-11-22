"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { OrderRecord } from "@/lib/orders";
import { formatINR, getAddOn, getColour, getSize } from "@/lib/products";

export default function OrderDetails({ id }: { id: string }) {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "error"; message: string } | { kind: "ok"; order: OrderRecord }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/orders/${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (!res.ok) {
          if (!cancelled) setState({ kind: "error", message: "not-found" });
          return;
        }
        const data = await res.json();
        if (!cancelled) setState({ kind: "ok", order: data.order as OrderRecord });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error", message: "network" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "loading") {
    return (
      <div className="py-16 text-center text-bark-soft">Looking up your order…</div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-4xl font-bold">Order not found</h1>
        <p className="mt-4 text-bark-soft max-w-md mx-auto">
          We couldn&apos;t find an order with the ID{" "}
          <span className="font-mono font-semibold">{id}</span>. Double-check
          the link, or start a fresh order.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  const { order } = state;

  return (
    <div className="py-6">
      <div className="rounded-3xl bg-moss text-cream p-8 sm:p-10 text-center">
        <p className="text-3xl">✓</p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold">
          Order confirmed — thank you!
        </h1>
        <p className="mt-3 text-cream/85">
          Order <span className="font-mono font-bold">{order.id}</span> · Pay
          on delivery · A confirmation went to {order.customer.email}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-sand bg-parchment p-7">
          <h2 className="font-display text-2xl font-bold">What&apos;s coming</h2>
          <ul className="mt-4 divide-y divide-sand text-sm">
            {order.items.map((item, i) => {
              const size = getSize(item.size as never);
              const colour = getColour(item.colour as never);
              const addOns = (item.addOns as string[]).map((a) => getAddOn(a as never));
              return (
                <li key={i} className="py-3 flex justify-between gap-4">
                  <span>
                    Refill — {size.shortLabel} · {colour.label}
                    {addOns.length > 0 &&
                      ` + ${addOns.map((a) => a.label).join(", ")}`}
                    <span className="block text-bark-soft">× {item.qty}</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatINR(item.unitPrice * item.qty)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-sand space-y-1.5 text-sm">
            <div className="flex justify-between text-bark-soft">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-bark-soft">
              <span>Delivery</span>
              <span className="font-semibold text-moss-dark">
                {order.deliveryFee === 0 ? "FREE" : formatINR(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sand items-baseline">
              <span className="font-semibold">Total (pay on delivery)</span>
              <span className="font-display text-2xl font-bold">
                {formatINR(order.total)}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-sand bg-parchment p-7">
          <h2 className="font-display text-2xl font-bold">Delivering to</h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-bark-soft">
            <span className="block font-semibold text-bark">{order.customer.name}</span>
            {order.customer.address}
            <br />
            {order.customer.city}, {order.customer.state} — {order.customer.pin}
            <br />
            {order.customer.phone}
            <br />
            {order.customer.email}
          </address>
          <p className="mt-6 text-sm text-bark-soft">
            We&apos;ll call this number before delivery to fix a time. Keep the
            good behaviour treats ready — your dog has earned them.
          </p>
          <Link
            href="/how-it-works"
            className="mt-6 inline-block rounded-full border-2 border-bark px-6 py-2.5 text-sm font-semibold text-bark hover:bg-cream transition-colors"
          >
            Learn how to set up your sessions
          </Link>
        </section>
      </div>
    </div>
  );
}
