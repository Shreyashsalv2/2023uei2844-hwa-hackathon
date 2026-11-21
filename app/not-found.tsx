import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        404
      </p>
      <h1 className="font-display mt-3 text-4xl sm:text-5xl font-bold">
        This page fetched nothing.
      </h1>
      <p className="mt-4 text-bark-soft max-w-md mx-auto">
        Even our feeder never comes up empty — but this page does. Let&apos;s
        get you back to something worthwhile.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/shop"
          className="rounded-full border-2 border-bark px-8 py-3 text-base font-semibold text-bark hover:bg-parchment transition-colors"
        >
          Shop Refill
        </Link>
      </div>
    </div>
  );
}
