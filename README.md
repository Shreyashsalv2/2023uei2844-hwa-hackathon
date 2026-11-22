# Refill — the self-resetting puzzle feeder for dogs

A demo storefront built with Next.js (App Router), TypeScript and Tailwind CSS, deployed on Vercel.

- Product: Refill, a self-resetting puzzle feeder — sealed kibble hopper, rotating tray that reshuffles after every level, scheduled sessions.
- Sizes: Small/Medium (5–25 kg) ₹4,999 · Large (25 kg+) ₹5,999
- Colours: Clay, Moss, Sandstone · Scent Pod add-on +₹499
- Free delivery on feeder orders · Pay on Delivery only

## Orders API

Full documentation lives at **`/api-docs`** on the live site.

```
POST /api/orders          place an order  (Content-Type: application/json)
GET  /api/orders/{id}     look up one order (email/phone masked) · 404 if unknown
GET  /api/orders          405 — order lists are not exposed
```

Request body:

```json
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
    { "productId": "refill", "variant": "large-moss", "quantity": 1, "add-ons": ["scent-pod"] }
  ]
}
```

- Valid variants: `small-medium-clay`, `small-medium-moss`, `small-medium-sandstone`, `large-clay`, `large-moss`, `large-sandstone`
- Valid add-ons: `scent-pod`
- `quantity`: integer 1–10
- The older `size` / `colour` / `qty` / `addOns` fields are also accepted
- Prices are recalculated server-side; totals sent by the client are ignored
- Unknown variants/add-ons return 400 with the valid IDs listed in the error message

## Storage

Orders are stored in Upstash Redis (via the Vercel Marketplace) with no expiry. When the Redis environment variables are absent (local dev, builds), the app falls back to an in-process in-memory store.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```
