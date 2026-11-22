"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ZONES = 6;

function newPattern(): boolean[] {
  const pattern = Array.from({ length: ZONES }, () => Math.random() > 0.35);
  if (!pattern.some(Boolean)) pattern[Math.floor(Math.random() * ZONES)] = true;
  return pattern;
}

export default function TrayDemo() {
  const [pattern, setPattern] = useState<boolean[]>(() => newPattern());
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(ZONES).fill(false));
  const [level, setLevel] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [kibbleEaten, setKibbleEaten] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const solved = revealed.every(Boolean);

  const reshuffle = useCallback(() => {
    setSpinning(true);
    timer.current = setTimeout(() => {
      setPattern(newPattern());
      setRevealed(Array(ZONES).fill(false));
      setLevel((l) => l + 1);
      setSpinning(false);
    }, 900);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function poke(index: number) {
    if (spinning || revealed[index]) return;
    const next = [...revealed];
    next[index] = true;
    setRevealed(next);
    if (pattern[index]) setKibbleEaten((k) => k + 1);
    if (next.every(Boolean)) reshuffle();
  }

  return (
    <div className="rounded-3xl bg-bark text-cream p-7 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold">
            Try it yourself
          </h3>
          <p className="mt-2 text-cream/70 max-w-md">
            You&apos;re the dog. Tap the tray zones to hunt out the kibble.
            Clear the tray — and watch Refill deal a brand-new pattern, just
            like the real feeder does after every level.
          </p>
        </div>
        <div className="text-sm text-cream/70 shrink-0">
          <p>
            Level <span className="font-display text-xl font-bold text-ember">{level}</span>
          </p>
          <p>
            Kibble found:{" "}
            <span className="font-semibold text-cream">{kibbleEaten}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-ember-dark/40 border-4 border-ember transition-transform duration-700 ease-in-out ${
            spinning ? "rotate-[360deg] scale-95" : "rotate-0"
          }`}
          role="application"
          aria-label="Interactive puzzle tray demo"
        >
          {pattern.map((hasKibble, i) => {
            const angle = (360 / ZONES) * i;
            return (
              <button
                key={`${level}-${i}`}
                type="button"
                onClick={() => poke(i)}
                disabled={spinning}
                aria-label={`Tray zone ${i + 1}${revealed[i] ? (hasKibble ? ", found kibble" : ", empty") : ", hidden"}`}
                className={`absolute w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                  revealed[i]
                    ? hasKibble
                      ? "bg-moss scale-100"
                      : "bg-cream/10 scale-95"
                    : "bg-cream/25 hover:bg-cream/40 hover:scale-105 active:scale-95"
                } disabled:cursor-default`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-86px) rotate(-${angle}deg)`,
                }}
              >
                {revealed[i] ? (hasKibble ? "🦴" : "·") : "?"}
              </button>
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-ember flex items-center justify-center font-display font-bold text-lg">
              {spinning ? "…" : "R"}
            </div>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-center text-sm font-medium">
        {spinning
          ? "Tray rotating — dealing a new pattern…"
          : solved
            ? "Solved! The tray resets itself. This never ends."
            : `${revealed.filter(Boolean).length} of ${ZONES} zones explored`}
      </p>
    </div>
  );
}
