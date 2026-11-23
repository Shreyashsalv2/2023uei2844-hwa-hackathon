"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FeederArt from "./FeederArt";

const Feeder3D = dynamic(() => import("./Feeder3D"), { ssr: false });

export default function HeroFeeder({ body, edge }: { body: string; edge: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (finePointer && !reduced) setEnabled(true);
  }, []);

  if (!enabled) {
    return <FeederArt body={body} edge={edge} className="w-full max-w-md h-auto mx-auto" />;
  }

  return <Feeder3D body={body} edge={edge} />;
}
