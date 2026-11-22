import type { Metadata } from "next";
import RefillConfigurator from "@/components/RefillConfigurator";
import { SIZES } from "@/lib/products";

export const metadata: Metadata = {
  title: "Refill — self-resetting puzzle feeder",
  description:
    "Configure your Refill feeder: Small/Medium or Large, in Clay, Moss or Sandstone, with the optional Scent Pod. Free delivery and Pay on Delivery across India.",
};

export default function RefillPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <RefillConfigurator />

      <section className="mt-20">
        <h2 className="font-display text-3xl font-bold">Specifications</h2>
        <p className="mt-2 text-bark-soft">
          Both sizes share the same brain — the differences are capacity and
          tray complexity.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {SIZES.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl border border-sand bg-parchment p-8"
            >
              <h3 className="font-display text-2xl font-bold">{s.label}</h3>
              <p className="mt-1 text-sm text-ember font-semibold">
                {s.weightRange}
              </p>
              <dl className="mt-6 divide-y divide-sand text-sm">
                {[
                  ["Dimensions", s.dimensions],
                  ["Hopper capacity", s.hopperCapacity],
                  ["Puzzle zones", `${s.puzzleZones} rotating compartments`],
                  ["Kibble size", s.kibbleSize],
                  ["Sessions per day", s.sessionsPerDay],
                  ["Power", "Rechargeable battery (up to 7 days) + USB-C mains"],
                  ["Materials", "Food-safe ABS shell, silicone tray liners"],
                  ["Warranty", "1 year — motor, hopper and tray"],
                  ["Cleaning", "Tray and hopper lid are rinse-safe"],
                ].map(([term, desc]) => (
                  <div key={term} className="flex justify-between gap-6 py-2.5">
                    <dt className="text-bark-soft shrink-0">{term}</dt>
                    <dd className="text-right font-medium">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-bark text-cream p-8 sm:p-12">
        <h2 className="font-display text-3xl font-bold">What&apos;s in the box</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-cream/80">
          {[
            "Refill feeder with rotating puzzle tray",
            "USB-C charging cable",
            "Quick-start feeding guide",
            "Session setup card for your dog's weight",
            ...(SIZES.map((s) => `${s.shortLabel}: spare silicone tray liner`)),
          ].map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ember shrink-0" />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
