import type { Metadata } from "next";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl font-bold">How it works</h1>
      <p className="mt-4 text-bark-soft">
        Hopper, rotating tray and session logic — plus the feeding scheduler —
        coming in the next build step.
      </p>
    </div>
  );
}
