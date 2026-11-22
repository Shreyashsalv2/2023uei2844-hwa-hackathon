import type { Metadata } from "next";
import Link from "next/link";
import FeederArt from "@/components/FeederArt";
import { SIZES, ADD_ONS, formatINR } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the Refill self-resetting puzzle feeder — Small/Medium and Large sizes, three colours, Pay on Delivery and free shipping across India.",
};

const perks = [
  { title: "Free delivery", text: "On every feeder, everywhere in India." },
  { title: "Pay on delivery", text: "Check your dog likes it before you pay." },
  { title: "1-year warranty", text: "Motor, hopper and tray covered." },
];

export default function ShopPage() {
  const from = Math.min(...SIZES.map((s) => s.price));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        The shop
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold">
        One product, made properly.
      </h1>
      <p className="mt-4 max-w-2xl text-bark-soft leading-relaxed">
        We build one thing: a feeder that never stops puzzling your dog. Pick
        the size for your dog and the colour for your floor.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <Link
          href="/products/refill"
          className="group lg:col-span-2 rounded-3xl bg-parchment border border-sand p-8 flex flex-col sm:flex-row gap-8 items-center hover:border-ember transition-colors"
        >
          <div className="shrink-0">
            <FeederArt body="#c96f4a" edge="#a8532f" className="w-56 h-auto" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold group-hover:text-ember transition-colors">
              Refill
            </h2>
            <p className="mt-2 text-bark-soft leading-relaxed">
              The self-resetting puzzle feeder. Sealed kibble hopper, rotating
              tray, scheduled sessions. For dogs from 5 kg up.
            </p>
            <p className="mt-4 text-lg font-semibold">
              From {formatINR(from)}
            </p>
            <p className="mt-1 text-sm text-bark-soft">
              2 sizes · 3 colours · Scent Pod add-on available
            </p>
            <span className="mt-5 inline-block rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-cream group-hover:bg-ember-dark transition-colors">
              Configure & add to cart
            </span>
          </div>
        </Link>

        <div className="rounded-3xl bg-bark text-cream p-8 flex flex-col">
          <h2 className="font-display text-2xl font-bold">
            Scent Pod <span className="text-cream/60 text-lg">add-on</span>
          </h2>
          <p className="mt-3 text-sm text-cream/70 leading-relaxed flex-1">
            {ADD_ONS[0].description}
          </p>
          <p className="mt-4 text-lg font-semibold">
            + {formatINR(ADD_ONS[0].price)}
          </p>
          <p className="mt-1 text-sm text-cream/60">
            Added on the product page when you configure your Refill.
          </p>
          <Link
            href="/products/refill"
            className="mt-5 inline-block text-center rounded-full border-2 border-cream/40 px-6 py-2.5 text-sm font-semibold text-cream hover:border-ember hover:text-ember transition-colors"
          >
            Add it to your Refill
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {perks.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-sand bg-cream p-6"
          >
            <p className="font-semibold">{p.title}</p>
            <p className="mt-1 text-sm text-bark-soft">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
