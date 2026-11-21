import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl font-bold">Shop</h1>
      <p className="mt-4 text-bark-soft">
        The Refill range — coming in the next build step.
      </p>
    </div>
  );
}
