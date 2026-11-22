import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API docs",
  description: "How to place and look up Refill orders through our API.",
};

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-2xl bg-bark text-cream/90 p-5 text-xs sm:text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-ember">
        For testers and integrators
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold">Orders API</h1>
      <p className="mt-4 text-bark-soft leading-relaxed">
        The Refill shop exposes a small JSON API for placing orders and
        looking them up afterwards. No authentication is needed — this is a
        demo shop and payment is Pay on Delivery.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">
          POST /api/orders — place an order
        </h2>
        <p className="mt-3 text-bark-soft">
          Send <code className="font-mono text-sm">Content-Type: application/json</code>{" "}
          with a customer and a list of items. Each item needs a{" "}
          <code className="font-mono text-sm">variant</code> (size + colour),
          a <code className="font-mono text-sm">quantity</code> from 1 to 10,
          and optionally <code className="font-mono text-sm">add-ons</code>.
        </p>
        <Code>{`POST /api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Asha Rao",
    "email": "asha@example.in",
    "phone": "9876543210",
    "address": "12 Park Lane, Koregaon Park",
    "city": "Pune",
    "state": "Maharashtra",
    "pin": "411001"
  },
  "items": [
    {
      "productId": "refill",
      "variant": "large-moss",
      "quantity": 1,
      "add-ons": ["scent-pod"]
    }
  ]
}`}</Code>

        <h3 className="mt-6 font-semibold">Valid variant IDs</h3>
        <p className="mt-2 text-bark-soft text-sm">
          A variant is <code className="font-mono">{"{size}-{colour}"}</code>:
        </p>
        <ul className="mt-2 grid gap-1 text-sm text-bark-soft sm:grid-cols-2">
          {[
            "small-medium-clay",
            "small-medium-moss",
            "small-medium-sandstone",
            "large-clay",
            "large-moss",
            "large-sandstone",
          ].map((v) => (
            <li key={v} className="font-mono">
              {v}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-bark-soft">
          The only valid add-on ID is{" "}
          <code className="font-mono">scent-pod</code> (+₹499). The older{" "}
          <code className="font-mono">size</code> /{" "}
          <code className="font-mono">colour</code> /{" "}
          <code className="font-mono">qty</code> /{" "}
          <code className="font-mono">addOns</code> fields are also accepted.
        </p>

        <h3 className="mt-6 font-semibold">Success — 201</h3>
        <Code>{`{
  "orderId": "RFL-X4K2QP",
  "order": {
    "id": "RFL-X4K2QP",
    "createdAt": "2026-11-22T03:01:15.362Z",
    "customer": { ... },
    "items": [ { "productId": "refill", "size": "large", "colour": "moss",
                 "addOns": ["scent-pod"], "quantity": 1, "unitPrice": 6498 } ],
    "subtotal": 6498,
    "deliveryFee": 0,
    "total": 6498,
    "payment": "pay-on-delivery",
    "status": "confirmed"
  }
}`}</Code>
        <p className="mt-3 text-sm text-bark-soft">
          Prices are always recalculated on the server — item totals in the
          request are ignored.
        </p>

        <h3 className="mt-6 font-semibold">Errors</h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-sand">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-sand">
              {[
                ["415", "Content-Type is not application/json"],
                ["400", "Malformed JSON body"],
                ["400", "Empty items list"],
                ["400", "Unknown variant / add-on (valid IDs listed in the message)"],
                ["400", "Quantity missing, not a number, not a whole number, or outside 1–10"],
                ["400", "Invalid name, email, phone (10-digit Indian mobile), address, city, state or 6-digit PIN"],
                ["405", "GET on /api/orders — order lists are not exposed"],
                ["413", "Request body over 20 KB"],
              ].map(([code, desc]) => (
                <tr key={code + desc} className="bg-parchment">
                  <td className="px-4 py-2 font-mono font-semibold align-top">{code}</td>
                  <td className="px-4 py-2 text-bark-soft">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-bark-soft">
          Every error response has the shape{" "}
          <code className="font-mono">{`{ "error": "message" }`}</code>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">
          GET /api/orders/&#123;id&#125; — look up an order
        </h2>
        <p className="mt-3 text-bark-soft">
          Returns the stored order. Email and phone are partially masked for
          privacy; unknown or malformed IDs return 404.
        </p>
        <Code>{`GET /api/orders/RFL-X4K2QP

200 OK
{
  "order": {
    "id": "RFL-X4K2QP",
    "customer": { "name": "Asha Rao", "email": "a***@example.in",
                  "phone": "98******10", ... },
    "total": 6498,
    "payment": "pay-on-delivery",
    "status": "confirmed"
  }
}`}</Code>
        <p className="mt-3 text-sm text-bark-soft">
          Orders are stored without an expiry, so lookups keep working
          indefinitely. <code className="font-mono">GET /api/orders</code>{" "}
          (the list) intentionally returns 405 — no customer lists are exposed.
        </p>
      </section>
    </div>
  );
}
