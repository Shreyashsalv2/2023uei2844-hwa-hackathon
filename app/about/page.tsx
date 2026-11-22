import type { Metadata } from "next";
import Link from "next/link";
import FeederArt from "@/components/FeederArt";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-ember">
            About Refill
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold">
            We make one thing, and we make it well.
          </h1>
          <p className="mt-5 text-bark-soft leading-relaxed">
            Refill started with a familiar guilt: coming home to a dog who had
            nothing to do for eight hours, next to a puzzle toy solved and
            abandoned in the first ten minutes.
          </p>
          <p className="mt-4 text-bark-soft leading-relaxed">
            Every &quot;engagement&quot; toy on the market shares the same
            flaw — a human has to reload it. So we built a feeder that loads
            once and puzzles all day: a sealed hopper for the food, a rotating
            tray that deals a new pattern after every level, and sessions that
            keep treats safe from boredom-eating.
          </p>
          <p className="mt-4 text-bark-soft leading-relaxed">
            We don&apos;t make collars, cameras or subscription kibble. We
            make the machine that keeps your dog&apos;s mind busy while
            you&apos;re out — and we&apos;re always improving that one thing.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/how-it-works"
              className="rounded-full bg-ember px-7 py-3 text-sm font-semibold text-cream hover:bg-ember-dark transition-colors"
            >
              See how it works
            </Link>
            <Link
              href="/shop"
              className="rounded-full border-2 border-bark px-7 py-3 text-sm font-semibold text-bark hover:bg-parchment transition-colors"
            >
              Shop Refill
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-parchment border border-sand p-8 flex justify-center">
          <FeederArt body="#d9c7a7" edge="#b8a382" className="w-full max-w-sm h-auto" />
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          ["One product", "All our effort goes into the feeder — no half-made side projects."],
          ["Built for Indian homes", "Ant-sealed hopper, mains or battery power, and Pay on Delivery everywhere."],
          ["Honest by default", "No testimonials, no invented numbers — just the machine and a 1-year warranty."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-sand bg-parchment p-6">
            <p className="font-semibold">{title}</p>
            <p className="mt-2 text-sm text-bark-soft leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
