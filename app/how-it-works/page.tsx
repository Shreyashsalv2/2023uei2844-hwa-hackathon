import type { Metadata } from "next";
import Link from "next/link";
import FeederArt from "@/components/FeederArt";
import FeedingScheduler from "@/components/FeedingScheduler";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How the Refill self-resetting puzzle feeder works: the sealed hopper, the rotating tray, session scheduling and portion control.",
};

const PARTS = [
  {
    title: "The sealed hopper",
    text: "Holds up to 3 kg (Large: 5 kg) of kibble, sealed against moisture and ants. One pour covers your dog for days — the feeder releases it session by session.",
  },
  {
    title: "The rotating tray",
    text: "A quiet motor turns the tray between levels. Each turn deals kibble into a new random pattern across 4 puzzle zones (6 on the Large), so no two rounds are ever the same.",
  },
  {
    title: "The puzzle zones",
    text: "Silicone-lined compartments your dog opens by nosing and pawing. They're sized for kibble up to 15 mm (20 mm on Large) and pop out for rinsing.",
  },
  {
    title: "The session brain",
    text: "You choose how many sessions run per day and how big each share is. Refill keeps the schedule, releases only its share, and seals itself between sessions.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        How it works
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold">
        A puzzle toy that reloads itself.
      </h1>
      <p className="mt-4 max-w-2xl text-bark-soft leading-relaxed">
        Refill combines three things that never coexist in a puzzle toy: a
        sealed food store, a tray that deals fresh patterns on its own, and a
        schedule that protects your dog from overeating.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-5">
          {PARTS.map((part, i) => (
            <div key={part.title} className="rounded-3xl border border-sand bg-parchment p-6 flex gap-5">
              <span className="font-display text-3xl font-bold text-ember shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{part.title}</p>
                <p className="mt-1.5 text-sm text-bark-soft leading-relaxed">{part.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-parchment border border-sand p-8 flex items-center justify-center">
          <FeederArt body="#6b7f59" edge="#556845" className="w-full max-w-md h-auto" />
        </div>
      </div>

      <div className="mt-16">
        <FeedingScheduler />
      </div>

      <div className="mt-16 rounded-3xl bg-ember text-cream p-8 sm:p-12 text-center">
        <h2 className="font-display text-3xl font-bold">
          Set it up once. Your dog does the rest.
        </h2>
        <Link
          href="/products/refill"
          className="mt-6 inline-block rounded-full bg-cream px-10 py-3.5 text-base font-semibold text-bark hover:bg-parchment transition-colors"
        >
          Configure your Refill
        </Link>
      </div>
    </div>
  );
}
