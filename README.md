# Refill — the self-resetting puzzle feeder for dogs

**Live site: https://2023uei2844-hwa-hackathon.vercel.app**

Refill is a storefront for a self-resetting puzzle feeder for dogs: a sealed
kibble hopper, a rotating tray that deals a new puzzle pattern after every
level, and scheduled sessions that keep dogs engaged all day without
overeating. This repo is the complete e-commerce site for it — product pages,
cart, checkout, and a small orders API.

## Features

- **Storefront** — home page (problem, 8-hour session timeline, interactive
  puzzle-tray demo, comparison vs regular puzzle toys, FAQ), shop, product
  configurator (Small/Medium ₹4,999 · Large ₹5,999, colours Clay / Moss /
  Sandstone, Scent Pod add-on +₹499) with live price updates and full specs
- **Interactive 3D hero** — react-three-fiber model, drag to rotate, smooth
  colour transitions; lazy-loaded with an SVG fallback, WebGL check and an
  error boundary so the page never crashes
- **Cart & checkout** — localStorage cart, quantity 1–10, Indian address
  form (state dropdown, 10-digit mobile, 6-digit PIN), Pay on Delivery only,
  free delivery on feeder orders, inline field-level errors with
  `aria-invalid` / `aria-describedby`
- **Orders API** — strict server-side validation and pricing; orders stored
  in Upstash Redis (via the Vercel Marketplace) with no expiry, in-memory
  fallback for local dev
- **More pages** — how-it-works with a weight-based feeding scheduler,
  FAQ, About, Contact (working form → ticket IDs), Shipping & Returns,
  Privacy, API docs, custom 404
- **Polish** — page transitions, scroll-reveal animations, animated
  timeline, cart-badge bounce, `prefers-reduced-motion` respected, accessible
  radio groups for colours, custom 404

## Tech stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- react-three-fiber + three.js (lazy-loaded 3D hero)
- Upstash Redis (Vercel Marketplace) with in-memory fallback
- Deployed on Vercel

## How to run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

No env vars are required for local dev — without Redis credentials the app
automatically uses an in-memory order store.

## Environment variables (set automatically by the Vercel Marketplace)

| Name | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL` or `KV_REST_API_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_TOKEN` | Upstash Redis REST token |

When both are absent, orders fall back to an in-process in-memory store.

## API

Full docs: **`/api-docs`** on the live site.

### Place an order

```bash
curl -X POST https://2023uei2844-hwa-hackathon.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

`201` → `{ "orderId": "RFL-XXXXXX", "order": { ... } }`

Valid variants: `small-medium-clay`, `small-medium-moss`,
`small-medium-sandstone`, `large-clay`, `large-moss`, `large-sandstone`.
Valid add-ons: `scent-pod`. `quantity`: integer 1–10. The older
`size` / `colour` / `qty` / `addOns` fields are also accepted.

### Look up an order

```bash
curl https://2023uei2844-hwa-hackathon.vercel.app/api/orders/RFL-XXXXXX
```

`200` → `{ "order": { ... } }` (email and phone partially masked) · unknown
or malformed ID → `404`.

### Validation errors

Every 400 reports all failing fields at once:

```bash
curl -X POST https://2023uei2844-hwa-hackathon.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer":{"email":"bad"},"items":[{"productId":"refill","variant":"giant-teal","quantity":11}]}'
```

```json
{
  "error": "validation failed",
  "fields": {
    "customer.email": "invalid email",
    "items.0.variant": "unknown variant \"giant-teal\" (valid variants: small-medium-clay, ...)",
    "items.0.quantity": "quantity must be between 1 and 10"
  }
}
```

Other status codes: `415` wrong content type · `405` on `GET /api/orders`
(order lists are never exposed) · `413` body over 20 KB · bad input never
returns a 500.

### Contact form

```bash
curl -X POST https://2023uei2844-hwa-hackathon.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Rao","email":"asha@example.in","subject":"Sizing","message":"Will the large tray fit a golden retriever?"}'
```

`201` → `{ "ticketId": "CT-XXXXXX" }`
