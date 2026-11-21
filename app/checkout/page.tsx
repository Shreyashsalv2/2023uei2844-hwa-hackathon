import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl font-bold">Checkout</h1>
      <p className="mt-4 text-bark-soft">
        Checkout — coming in the next build step.
      </p>
    </div>
  );
}
