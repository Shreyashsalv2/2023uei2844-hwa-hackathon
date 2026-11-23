"use client";

import { useMemo, useState } from "react";

interface Band {
  max: number;
  label: string;
  sessions: number;
  gramsPerSession: number;
  minutes: number;
}

const BANDS: Band[] = [
  { max: 10, label: "Small (up to 10 kg)", sessions: 3, gramsPerSession: 50, minutes: 20 },
  { max: 25, label: "Small / Medium (5–25 kg)", sessions: 4, gramsPerSession: 85, minutes: 25 },
  { max: 100, label: "Large (25 kg+)", sessions: 4, gramsPerSession: 140, minutes: 30 },
];

const START_HOUR = 9;
const SPAN_HOURS = 8;

function fmtTime(hourFloat: number): string {
  const h24 = START_HOUR + hourFloat;
  const h = Math.floor(h24);
  const m = Math.round((h24 - h) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function FeedingScheduler() {
  const [weight, setWeight] = useState(18);

  const band = useMemo(
    () => BANDS.find((b) => weight <= b.max) ?? BANDS[BANDS.length - 1],
    [weight]
  );

  const sessions = useMemo(() => {
    const usable = SPAN_HOURS - band.minutes / 60;
    const gap = usable / (band.sessions - 1);
    return Array.from({ length: band.sessions }, (_, i) => i * gap);
  }, [band]);

  return (
    <div className="rounded-3xl border border-sand bg-parchment p-7 sm:p-10">
      <h3 className="font-display text-2xl sm:text-3xl font-bold">
        Build your dog&apos;s day
      </h3>
      <p className="mt-2 text-bark-soft max-w-2xl">
        Move the slider to your dog&apos;s weight — this is the exact kind of
        schedule you&apos;ll set once in the app. Sessions are spread evenly
        across your chosen 8-hour window.
      </p>

      <div className="mt-8">
        <div className="flex justify-between items-baseline">
          <label htmlFor="weight" className="text-sm font-semibold">
            Your dog&apos;s weight
          </label>
          <span className="font-display text-2xl font-bold text-ember">
            {weight} kg
          </span>
        </div>
        <input
          id="weight"
          type="range"
          min={5}
          max={45}
          step={1}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="mt-3 w-full accent-[#d96f32]"
        />
        <div className="flex justify-between text-xs text-bark-soft mt-1">
          <span>5 kg</span>
          <span>45 kg</span>
        </div>
      </div>

      <div aria-live="polite">
        <p className="mt-8 text-sm font-semibold">
          Suggested plan — {band.label}
        </p>
        <ul className="mt-4 space-y-3">
          {sessions.map((at, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-2xl bg-cream border border-sand px-5 py-3.5"
            >
              <span className="font-display text-lg font-bold text-ember w-24 shrink-0">
                {fmtTime(at)}
              </span>
              <span className="text-sm text-bark-soft flex-1">
                Session {i + 1} · {band.gramsPerSession} g released · about{" "}
                {band.minutes} min of puzzling
              </span>
              <span className="hidden sm:block text-xs text-bark-soft">
                {i < sessions.length - 1
                  ? `next in about ${Math.round((sessions[i + 1] - at) * 60)} min`
                  : "day winds down"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-bark-soft">
          Daily food totals shown are an illustration — always follow your
          vet&apos;s guidance and your kibble pack&apos;s feeding chart. The
          app lets you move, add or shorten sessions any time.
        </p>
      </div>
    </div>
  );
}
