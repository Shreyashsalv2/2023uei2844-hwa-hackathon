"use client";

import { useState } from "react";

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrors({});
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const fields = (data?.fields ?? {}) as Record<string, string>;
        const mapped: FieldErrors = {};
        const other: string[] = [];
        for (const [key, message] of Object.entries(fields)) {
          if (key === "name" || key === "email" || key === "subject" || key === "message") {
            mapped[key] = message;
          } else {
            other.push(`${key}: ${message}`);
          }
        }
        if (Object.keys(mapped).length > 0) {
          setErrors(mapped);
        } else {
          setFormError(
            other.length > 0
              ? other.join(" · ")
              : data?.error ?? "Could not send your message. Please try again."
          );
        }
        setStatus("error");
        return;
      }
      setTicket(data.ticketId);
      setStatus("sent");
    } catch {
      setFormError("Network error — could not reach us. Please try again.");
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
      <Field
        id="contact-name"
        label="Your name"
        value={form.name}
        onChange={set("name")}
        placeholder="Your name"
        error={errors.name}
      />
      <Field
        id="contact-email"
        label="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="you@example.com"
        error={errors.email}
      />
      <Field
        id="contact-subject"
        label="Subject"
        value={form.subject}
        onChange={set("subject")}
        placeholder="Subject"
        error={errors.subject}
      />
      <Field
        id="contact-message"
        label="Message"
        type="textarea"
        value={form.message}
        onChange={set("message")}
        placeholder="How can we help?"
        error={errors.message}
      />
      {formError && (
        <p role="alert" className="rounded-xl border-2 border-ember-dark bg-parchment px-4 py-3 text-sm font-medium text-ember-dark">
          {formError}
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

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  error?: string;
}) {
  const inputClass = `mt-1.5 w-full rounded-xl border-2 bg-cream px-4 py-2.5 focus:outline-none ${
    error ? "border-ember-dark" : "border-sand focus:border-ember"
  }`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} <span className="text-ember">*</span>
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-ember-dark">
          {error}
        </p>
      )}
    </div>
  );
}
