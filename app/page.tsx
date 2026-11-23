import Link from "next/link";
import type { Metadata } from "next";
import FeederArt from "@/components/FeederArt";
import HeroFeeder from "@/components/HeroFeeder";
import Reveal from "@/components/Reveal";
import SessionTimeline from "@/components/SessionTimeline";
import TrayDemo from "@/components/TrayDemo";
import ComparisonTable from "@/components/ComparisonTable";

export const metadata: Metadata = {
  title: "Refill — the self-resetting puzzle feeder for dogs",
};

const HOW_STEPS = [
  {
    title: "The hopper loads once",
    text: "Pour in up to 3 kg (Large: 5 kg) of your dog's regular kibble. It stays sealed and fresh until a session opens.",
  },
  {
    title: "The tray deals a puzzle",
    text: "At session time, the rotating tray drops kibble into a random pattern of puzzle zones across the dish.",
  },
  {
    title: "Your dog solves it",
    text: "Nosing each zone open takes real work. Solve the level — and the tray rotates and deals a brand-new pattern.",
  },
  {
    title: "Sessions end on time",
    text: "Each session releases only its share of the day's food. When the schedule says done, Refill stays shut.",
  },
];

const FAQS = [
  {
    q: "Will my dog actually use it?",
    a: "Dogs are natural foragers — a tray that hides kibble under movable zones taps straight into that. Most dogs take to it within their first session, and the Scent Pod helps fence-sitters find the tray in week one.",
  },
  {
    q: "Can it overfeed my dog?",
    a: "No. Sessions release fixed shares of the day's kibble and you set how many run per day. The hopper stays sealed between sessions.",
  },
  {
    q: "What if the power goes out?",
    a: "The rechargeable battery runs the feeder for up to 7 days on its own, and USB-C mains charging keeps it topped up.",
  },
  {
    q: "Is it easy to clean?",
    a: "The tray and hopper lid pop off and are rinse-safe. The shell wipes down with a damp cloth.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ember">
              For dogs left home alone
            </p>
            <h1 className="font-display mt-4 text-4xl sm:text-6xl font-bold leading-tight">
              The puzzle that never runs out.
            </h1>
            <p className="mt-6 text-lg text-bark-soft leading-relaxed">
              Regular puzzle toys are solved in ten minutes. Refill is a
              self-resetting feeder — a sealed kibble hopper and a rotating
              tray that reshuffles itself after every level, with scheduled
              sessions that keep your dog busy all day without overeating.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors text-center"
              >
                Shop Refill — ₹4,999
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border-2 border-bark px-8 py-3 text-base font-semibold text-bark hover:bg-parchment transition-colors text-center"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-sm text-bark-soft">
              Free delivery · Pay on Delivery · 1-year warranty
            </p>
          </div>
          <div className="flex justify-center">
            <HeroFeeder body="#c96f4a" edge="#a8532f" />
          </div>
        </div>
      </section>

      <section className="bg-parchment border-y border-sand">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember">
              The problem
            </p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold">
              Puzzle toys are a ten-minute fix for an eight-hour day.
            </h2>
            <p className="mt-4 text-bark-soft leading-relaxed">
              You buy a clever puzzle toy. Your dog loves it — for exactly as
              long as it takes to empty. Then it&apos;s an empty plastic
              shell on the floor, and your dog is back to watching the door
              for the next eight hours. Bored dogs develop the habits you
              come home to: shredded shoes, barked-at windows, emptied bins.
            </p>
            <p className="mt-4 text-bark-soft leading-relaxed">
              The toy isn&apos;t the problem. The refilling is. So Refill
              does the refilling itself.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              ["10 min", "How long a regular puzzle toy occupies most dogs"],
              ["8+ hrs", "A typical workday your dog spends alone"],
              ["1 pour", "How often you load Refill — it lasts for days"],
            ].map(([stat, text]) => (
              <div key={stat} className="rounded-2xl bg-cream border border-sand p-6 text-center">
                <p className="font-display text-4xl font-bold text-ember">{stat}</p>
                <p className="mt-2 text-sm text-bark-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-ember">
          How it works
        </p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold">
          Load once. It puzzles all day.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-3xl border border-sand bg-parchment p-6">
              <p className="font-display text-3xl font-bold text-ember">{i + 1}</p>
              <p className="mt-3 font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-bark-soft leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        </Reveal>
        <Reveal delay={100}>
        <p className="mt-6 text-sm text-bark-soft">
          Want the full detail — including the session scheduler?{" "}
          <Link href="/how-it-works" className="font-semibold text-ember-dark hover:text-ember underline underline-offset-4">
            See how it works
          </Link>
        </p>
        </Reveal>
      </section>

      <section className="bg-parchment border-y border-sand">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <Reveal>
            <SessionTimeline />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <Reveal>
          <TrayDemo />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-ember">
          Refill vs. the toy drawer
        </p>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold">
          Why a feeder beats another puzzle toy
        </h2>
        <div className="mt-8">
          <ComparisonTable />
        </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <Reveal>
        <h2 className="font-display text-3xl sm:text-4xl font-bold">
          Common questions
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-sand bg-parchment p-6">
              <p className="font-semibold">{faq.q}</p>
              <p className="mt-2 text-sm text-bark-soft leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-bark-soft">
          More questions?{" "}
          <Link href="/faq" className="font-semibold text-ember-dark hover:text-ember underline underline-offset-4">
            Read the full FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-ember-dark hover:text-ember underline underline-offset-4">
            write to us
          </Link>
          .
        </p>
        </Reveal>
      </section>

      <section className="bg-ember">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center text-cream">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Give your dog a day worth staying awake for.
          </h2>
          <p className="mt-3 text-cream/85 max-w-xl mx-auto">
            Free delivery, Pay on Delivery, and a 1-year warranty. Your dog
            handles the rest.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-cream px-10 py-3.5 text-base font-semibold text-bark hover:bg-parchment transition-colors"
          >
            Shop Refill — from ₹4,999
          </Link>
        </div>
      </section>
    </div>
  );
}
