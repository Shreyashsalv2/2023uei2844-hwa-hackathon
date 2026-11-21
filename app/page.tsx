import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-ember">
          For dogs left home alone
        </p>
        <h1 className="font-display mt-4 text-4xl sm:text-6xl font-bold leading-tight text-bark">
          The puzzle that never runs out.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-bark-soft leading-relaxed">
          Regular puzzle toys are solved in ten minutes. Refill is a
          self-resetting feeder — a sealed kibble hopper and a rotating tray
          that reshuffles itself after every level, with scheduled sessions
          that keep your dog busy all day without overeating.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors"
          >
            Shop Refill — ₹4,999
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-full border-2 border-bark px-8 py-3 text-base font-semibold text-bark hover:bg-parchment transition-colors"
          >
            See how it works
          </Link>
        </div>
      </section>

      <section className="bg-parchment border-y border-sand">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-moss-dark">
            Coming up on this page
          </p>
          <p className="mt-3 text-bark-soft">
            The 8-hour session timeline, the interactive tray demo, and the
            comparison against regular puzzle toys.
          </p>
        </div>
      </section>
    </div>
  );
}
