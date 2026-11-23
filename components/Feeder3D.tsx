"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

function LerpMaterial({ hex, rough = 0.5 }: { hex: string; rough?: number }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const target = useMemo(() => new THREE.Color(hex), [hex]);
  useFrame((_, delta) => {
    const m = ref.current;
    if (m) m.color.lerp(target, Math.min(1, delta * 5));
  });
  return <meshStandardMaterial ref={ref} color={hex} roughness={rough} />;
}

function Zone({ angle, radius, hex }: { angle: number; radius: number; hex: string }) {
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return (
    <mesh position={[x, 0.02, z]}>
      <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
      <LerpMaterial hex={hex} rough={0.7} />
    </mesh>
  );
}

function Feeder({ body, edge }: { body: string; edge: string }) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, lastX: 0 });

  return (
    <group ref={group} rotation={[0.28, 0.6, 0]}>
      {/* tray base */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 0.32, 48]} />
        <LerpMaterial hex={body} />
      </mesh>
      {/* rim */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.07, 16, 64]} />
        <LerpMaterial hex={edge} />
      </mesh>
      {/* hub */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.34, 0.42, 0.16, 32]} />
        <LerpMaterial hex={edge} />
      </mesh>
      {/* puzzle zones */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Zone key={i} angle={(Math.PI / 3) * i} radius={0.82} hex={edge} />
      ))}
      {/* hopper */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.52, 0.64, 0.85, 32]} />
        <LerpMaterial hex={body} />
      </mesh>
      {/* hopper lid */}
      <mesh position={[0, 1.17, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.1, 32]} />
        <LerpMaterial hex={edge} />
      </mesh>
      {/* lid dome */}
      <mesh position={[0, 1.24, 0]}>
        <sphereGeometry args={[0.26, 24, 16]} />
        <LerpMaterial hex={body} />
      </mesh>
      {/* spout knob */}
      <mesh position={[0, 0.32, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
        <LerpMaterial hex={edge} />
      </mesh>
    </group>
  );
}

export default function Feeder3D({ body, edge }: { body: string; edge: string }) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, lastX: 0, autoRotate: true });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active || !group.current) return;
    group.current.rotation.y += (e.clientX - drag.current.lastX) * 0.012;
    drag.current.lastX = e.clientX;
  }
  function onPointerUp() {
    drag.current.active = false;
  }

  return (
    <div
      className="w-full aspect-square max-w-md mx-auto cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      role="img"
      aria-label="Interactive 3D model of the Refill feeder — drag to rotate"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 4.2], fov: 38 }}
        style={{ touchAction: "none" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 2]} intensity={1.4} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} />
        <group ref={group} rotation={[0.28, 0.6, 0]}>
          <Spin group={group} drag={drag} />
          <Feeder body={body} edge={edge} />
        </group>
        <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.9, 48]} />
          <meshStandardMaterial color="#e6d5bc" roughness={0.9} opacity={0.6} transparent />
        </mesh>
      </Canvas>
    </div>
  );
}

function Spin({
  group,
  drag,
}: {
  group: React.RefObject<THREE.Group | null>;
  drag: MutableRefObject<{ active: boolean; lastX: number; autoRotate: boolean }>;
}) {
  useFrame((state, delta) => {
    const g = group.current;
    if (!g || drag.current.active) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      g.rotation.y += delta * 0.35;
    }
  });
  return null;
}
