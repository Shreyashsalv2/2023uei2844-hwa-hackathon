"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Could not send your message. Please try again.");
        setStatus("error");
        return;
      }
      setTicket(data.ticketId);
      setStatus("sent");
    } catch {
      setError("Network error — could not reach us. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent" && ticket) {
    return (
      <div className="rounded-3xl border-2 border-moss bg-cream p-8 text-center">
        <p className="text-3xl">✓</p>
        <h2 className="font-display mt-2 text-2xl font-bold">Message sent</h2>
        <p className="mt-2 text-sm text-bark-soft">
          Your ticket is <span className="font-mono font-semibold">{ticket}</span>.
          We reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          aria-label="Your name"
          placeholder="Your name *"
          required
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          className="rounded-xl border-2 border-sand bg-cream px-4 py-2.5 focus:border-ember focus:outline-none"
        />
        <input
          aria-label="Your email"
          type="email"
          placeholder="Email *"
          required
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          className="rounded-xl border-2 border-sand bg-cream px-4 py-2.5 focus:border-ember focus:outline-none"
        />
      </div>
      <input
        aria-label="Subject"
        placeholder="Subject *"
        required
        value={form.subject}
        onChange={(e) => set("subject")(e.target.value)}
        className="w-full rounded-xl border-2 border-sand bg-cream px-4 py-2.5 focus:border-ember focus:outline-none"
      />
      <textarea
        aria-label="Message"
        placeholder="How can we help? *"
        required
        rows={5}
        value={form.message}
        onChange={(e) => set("message")(e.target.value)}
        className="w-full rounded-xl border-2 border-sand bg-cream px-4 py-2.5 focus:border-ember focus:outline-none"
      />
      {error && (
        <p role="alert" className="rounded-xl border-2 border-ember-dark bg-parchment px-4 py-3 text-sm font-medium text-ember-dark">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-ember px-8 py-3 text-base font-semibold text-cream hover:bg-ember-dark transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
