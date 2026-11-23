interface FeederArtProps {
  body: string;
  edge: string;
  className?: string;
}

export default function FeederArt({ body, edge, className }: FeederArtProps) {
  return (
    <svg
      viewBox="0 0 320 260"
      role="img"
      aria-label="Illustration of the Refill puzzle feeder"
      className={`feeder-art ${className ?? ""}`}
    >
      <ellipse cx="160" cy="238" rx="120" ry="10" fill="#3d2b1f" opacity="0.08" />
      <rect x="60" y="150" width="200" height="78" rx="30" fill={body} />
      <rect x="60" y="150" width="200" height="14" rx="7" fill={edge} opacity="0.55" />
      <circle cx="160" cy="150" r="92" fill={edge} />
      <circle cx="160" cy="146" r="84" fill={body} />
      <circle cx="160" cy="146" r="84" fill="none" stroke={edge} strokeWidth="6" opacity="0.7" />
      <circle cx="160" cy="146" r="30" fill={edge} />
      <circle cx="160" cy="146" r="10" fill={body} />
      {[
        { x: 160, y: 76, r: 13 },
        { x: 222, y: 108, r: 13 },
        { x: 230, y: 172, r: 13 },
        { x: 160, y: 214, r: 13 },
        { x: 96, y: 172, r: 13 },
        { x: 98, y: 108, r: 13 },
      ].map((k, i) => (
        <circle key={i} cx={k.x} cy={k.y} r={k.r} fill={edge} opacity="0.85" />
      ))}
      <rect x="118" y="34" width="84" height="40" rx="12" fill={edge} />
      <rect x="126" y="40" width="68" height="10" rx="5" fill={body} opacity="0.9" />
      <circle cx="160" cy="60" r="9" fill={body} opacity="0.9" />
    </svg>
  );
}
