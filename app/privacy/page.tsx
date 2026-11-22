import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

const SECTIONS = [
  ["What we collect", "Only what an order needs: your name, email, mobile number, delivery address and what you ordered. Nothing else — no trackers, no analytics scripts, no advertising pixels."],
  ["Why we collect it", "To deliver your order, call you before delivery, and support your warranty. That is the entire list of reasons."],
  ["How it's stored", "Orders live in an encrypted-at-rest store operated by Vercel and Upstash. We keep orders without an expiry so your warranty and support lookups always work."],
  ["Who can see it", "Our API never exposes customer lists, and when an order is looked up by its ID the email and phone are partially masked. Only our support process sees full details."],
  ["What we don't do", "We don't sell, rent or share your data. We don't send marketing email. We contact you only about your order."],
  ["Deleting your data", "Write to us with your order ID and we'll delete everything tied to it within 7 days, except what tax rules force us to keep."],
  ["Contact", "Privacy questions go through the contact form — include your order ID and we'll handle it within one working day."],
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        Privacy
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold">
        Short, because it&apos;s simple.
      </h1>
      <p className="mt-4 text-bark-soft">
        Last updated: November 2026.
      </p>
      <dl className="mt-10 space-y-4">
        {SECTIONS.map(([term, desc]) => (
          <div key={term} className="rounded-2xl border border-sand bg-parchment p-6">
            <dt className="font-semibold">{term}</dt>
            <dd className="mt-2 text-sm text-bark-soft leading-relaxed">{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
