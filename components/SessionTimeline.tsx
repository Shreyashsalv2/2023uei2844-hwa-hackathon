"use client";

import { useEffect, useRef, useState } from "react";

const HOURS = ["9 AM", "10", "11", "12", "1 PM", "2", "3", "4", "5 PM"];

const SESSIONS = [
  { at: 0, label: "Session 1", note: "Fresh pattern" },
  { at: 2.5, label: "Session 2", note: "New deal" },
  { at: 5, label: "Session 3", note: "Reshuffled" },
  { at: 7.5, label: "Session 4", note: "Last round" },
];

export default function SessionTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="rounded-3xl border border-sand bg-parchment p-7 sm:p-10">
      <h3 className="font-display text-2xl sm:text-3xl font-bold">
        One workday, four sessions
      </h3>
      <p className="mt-2 text-bark-soft max-w-2xl">
        You choose the schedule in the app — here&apos;s a typical day with
        four 25-minute sessions spread across 8 hours. Between sessions the
        hopper stays sealed, so your dog rests as easily as they play.
      </p>

      <div ref={ref} className="mt-10">
        <div className="relative h-24">
          <div className="absolute top-10 left-0 right-0 h-1.5 rounded-full bg-sand" />
          <div
            className={`absolute top-10 left-0 h-1.5 rounded-full bg-ember timeline-fill ${
              shown ? "timeline-fill-on" : ""
            }`}
          />
          {SESSIONS.map((s, i) => (
            <div
              key={s.label}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${(s.at / 8) * 100}%`, top: 0 }}
            >
              <div
                className={`rounded-full bg-ember text-cream text-xs font-semibold px-3 py-1.5 whitespace-nowrap timeline-dot ${
                  shown ? "timeline-dot-on" : ""
                }`}
                style={{ transitionDelay: `${400 + i * 350}ms` }}
              >
                {s.label}
              </div>
              <div className="w-0.5 h-5 bg-ember/60" />
              <div
                className={`w-5 h-5 rounded-full border-4 border-ember bg-cream -mt-0.5 timeline-dot ${
                  shown ? "timeline-dot-on" : ""
                }`}
                style={{ transitionDelay: `${550 + i * 350}ms` }}
              />
              <p className="mt-2 text-xs text-bark-soft whitespace-nowrap">{s.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-xs text-bark-soft font-medium">
          {HOURS.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 text-sm">
        {[
          ["Portioned", "Each session releases only its share of the day's kibble — no gorging."],
          ["Self-resetting", "After every solved level the tray rotates and deals a new pattern."],
          ["Quiet by design", "No grinding motors mid-session; the tray moves between levels only."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl bg-cream border border-sand p-4">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-bark-soft">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
