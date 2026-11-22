import type { OrderRecord } from "./orders";

const TTL_SECONDS = 60 * 60 * 24 * 30;
const keyFor = (id: string) => `order:${id}`;

const memory = new Map<string, { order: OrderRecord; expires: number }>();

function upstashConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function storageMode(): "upstash" | "memory" {
  return upstashConfig() ? "upstash" : "memory";
}

export async function saveOrder(order: OrderRecord): Promise<void> {
  const cfg = upstashConfig();
  if (cfg) {
    const res = await fetch(`${cfg.url}/set/${keyFor(order.id)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: JSON.stringify(order), ex: TTL_SECONDS }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Upstash write failed with status ${res.status}`);
    }
    return;
  }
  memory.set(order.id, {
    order,
    expires: Date.now() + TTL_SECONDS * 1000,
  });
}

export async function getOrder(id: string): Promise<OrderRecord | null> {
  const cfg = upstashConfig();
  if (cfg) {
    try {
      const res = await fetch(`${cfg.url}/get/${keyFor(id)}`, {
        headers: { Authorization: `Bearer ${cfg.token}` },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { result?: string | null };
      if (!data.result) return null;
      return JSON.parse(data.result) as OrderRecord;
    } catch {
      return null;
    }
  }
  const entry = memory.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    memory.delete(id);
    return null;
  }
  return entry.order;
}
