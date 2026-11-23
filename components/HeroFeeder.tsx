"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import FeederArt from "./FeederArt";

const Feeder3D = dynamic(() => import("./Feeder3D"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

class Feeder3DBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // scene failed to load or render — SVG fallback takes over
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function HeroFeeder({ body, edge }: { body: string; edge: string }) {
  const [enabled, setEnabled] = useState(false);
  const fallback = <FeederArt body={body} edge={edge} className="w-full max-w-md h-auto mx-auto" />;

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (finePointer && !reduced && hasWebGL()) setEnabled(true);
  }, []);

  if (!enabled) return fallback;

  return (
    <Feeder3DBoundary fallback={fallback}>
      <Feeder3D body={body} edge={edge} />
    </Feeder3DBoundary>
  );
}
