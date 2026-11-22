const ROWS: { feature: string; refill: string; regular: string }[] = [
  { feature: "Engagement per day", refill: "Hours, across scheduled sessions", regular: "5–10 minutes, once" },
  { feature: "Resets itself", refill: "Yes — tray reshuffles after every level", regular: "No — someone must reload it" },
  { feature: "Kibble capacity", refill: "Up to 3 kg (Large: 5 kg) sealed in the hopper", regular: "A handful, placed by hand" },
  { feature: "Portion control", refill: "Session-based shares, no gorging", regular: "Whatever you load at once" },
  { feature: "Pattern variety", refill: "New random pattern every level", regular: "Same puzzle, same hiding spots" },
  { feature: "Power", refill: "Rechargeable battery + USB-C mains", regular: "None needed" },
  { feature: "Works while you're out", refill: "All day, unattended", regular: "Only until it's empty" },
];

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-3xl border border-sand bg-parchment">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="bg-bark text-cream text-left">
            <th className="px-6 py-4 font-semibold rounded-tl-3xl">Feature</th>
            <th className="px-6 py-4 font-semibold text-ember">Refill</th>
            <th className="px-6 py-4 font-semibold rounded-tr-3xl">Regular puzzle toy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand">
          {ROWS.map((row) => (
            <tr key={row.feature}>
              <td className="px-6 py-4 font-medium">{row.feature}</td>
              <td className="px-6 py-4 text-bark">{row.refill}</td>
              <td className="px-6 py-4 text-bark-soft">{row.regular}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
