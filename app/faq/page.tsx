import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  ["Will my dog actually use it?", "Dogs are natural foragers — a tray that hides kibble under movable zones taps straight into that instinct. Most dogs take to it within their first session. If yours is a fence-sitter, add the Scent Pod: a familiar scent under the tray draws them back between sessions."],
  ["Can Refill overfeed my dog?", "No. Sessions release fixed shares of the day's kibble, and you decide how many sessions run per day. The hopper stays sealed between sessions, so there's nothing to graze on."],
  ["What sizes are there?", "Small/Medium for dogs from 5 kg to 25 kg (₹4,999) and Large for 25 kg and up (₹5,999). The Large has a bigger hopper (5 kg vs 3 kg), a larger tray with 6 puzzle zones, and handles kibble up to 20 mm."],
  ["How long does the battery last?", "Up to 7 days of normal scheduled use on one charge. Charge over USB-C overnight and it tops up in about 3 hours. You can also run it on mains permanently."],
  ["What kibble can I use?", "Dry kibble up to 15 mm (Small/Medium) or 20 mm (Large). If your kibble is unusually large or oily, write to us and we'll confirm compatibility."],
  ["How do I clean it?", "The tray and hopper lid pop off and are rinse-safe. The shell wipes with a damp cloth. Clean the tray weekly as you would any food bowl."],
  ["Is it noisy?", "The tray rotates only between levels — briefly and quietly. There are no grinding or pumping sounds during a session."],
  ["What if my dog is a heavy chewer?", "Refill's shell is food-safe ABS designed to resist paws and noses. It is not a chew toy — keep it out of unsupervised reach outside sessions if your dog destroys toys. The 1-year warranty covers the motor, hopper and tray against defects."],
  ["Where do you ship?", "Across India, free on every feeder order. Pay on Delivery only — cash or UPI at your door."],
  ["Can I return it?", "Yes — 7-day returns if the feeder is faulty or unused in original packaging. See Shipping & Returns for the details."],
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        Answers
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold">
        Frequently asked questions
      </h1>
      <div className="mt-10 space-y-3">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-sand bg-parchment p-5 open:bg-cream">
            <summary className="cursor-pointer font-semibold list-none flex justify-between items-center gap-4">
              {q}
              <span className="text-ember text-xl leading-none group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm text-bark-soft leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
      <div className="mt-10 rounded-2xl bg-parchment border border-sand p-6 text-center">
        <p className="text-sm text-bark-soft">
          Something we didn&apos;t cover?{" "}
          <Link href="/contact" className="font-semibold text-ember-dark hover:text-ember underline underline-offset-4">
            Write to us
          </Link>{" "}
          — we reply within a day.
        </p>
      </div>
    </div>
  );
}
