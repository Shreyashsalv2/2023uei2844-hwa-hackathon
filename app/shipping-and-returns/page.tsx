import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & returns" };

const SECTIONS = [
  {
    title: "Shipping",
    rows: [
      ["Where we ship", "Everywhere in India — metros, towns and most pin codes."],
      ["Delivery fee", "Free on every Refill feeder order. There is no small-order surcharge."],
      ["Speed", "Dispatch in 1–2 working days; delivery in 3–7 working days depending on your PIN code."],
      ["Tracking", "We share a tracking link by email the moment your feeder leaves the warehouse."],
      ["Payment", "Pay on Delivery only — cash or UPI at your door. No online prepayment is taken."],
    ],
  },
  {
    title: "Returns",
    rows: [
      ["Window", "7 days from delivery."],
      ["Damaged or defective", "We replace the unit free — send us a photo of the damage through the contact form with your order ID."],
      ["Changed your mind", "Return the feeder unused, in its original packaging, and we refund the full amount on collection."],
      ["Who pays pickup", "For defects: we do. For change-of-mind: a flat ₹250 is deducted from the refund."],
      ["Warranty", "1 year on the motor, hopper and tray against manufacturing defects — message us with your order ID and we'll repair or replace."],
    ],
  },
];

export default function ShippingAndReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        The fine print, kept fine
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold">
        Shipping & returns
      </h1>
      {SECTIONS.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="font-display text-2xl font-bold">{section.title}</h2>
          <dl className="mt-4 rounded-3xl border border-sand bg-parchment divide-y divide-sand text-sm">
            {section.rows.map(([term, desc]) => (
              <div key={term} className="flex flex-col sm:flex-row gap-1 sm:gap-6 px-6 py-4">
                <dt className="font-semibold sm:w-48 shrink-0">{term}</dt>
                <dd className="text-bark-soft">{desc}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
