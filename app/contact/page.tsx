import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-ember">
            Contact
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold">Talk to us</h1>
          <p className="mt-4 text-bark-soft leading-relaxed">
            Questions about sizing, feeding schedules, an order you&apos;ve
            placed or a repair under warranty — write to us and we&apos;ll
            reply within one working day.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="rounded-2xl border border-sand bg-parchment p-5">
              <p className="font-semibold">Email</p>
              <p className="mt-1 text-bark-soft">hello@refill.example — we read everything.</p>
            </div>
            <div className="rounded-2xl border border-sand bg-parchment p-5">
              <p className="font-semibold">Order help</p>
              <p className="mt-1 text-bark-soft">
                Include your order ID (it looks like RFL-XXXXXX) and we&apos;ll
                find it instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-sand bg-parchment p-5">
              <p className="font-semibold">Hours</p>
              <p className="mt-1 text-bark-soft">Monday to Saturday, 10 AM – 6 PM IST.</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-sand bg-parchment p-7 sm:p-9 h-fit">
          <h2 className="font-display text-2xl font-bold">Send a message</h2>
          <p className="mt-1 text-sm text-bark-soft mb-6">
            It really sends — you&apos;ll get a ticket ID.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
