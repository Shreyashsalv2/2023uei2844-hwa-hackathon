import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/store";
import type { OrderRecord } from "@/lib/orders";

export const runtime = "nodejs";

const ORDER_ID_RE = /^RFL-[A-Z0-9]{6}$/;

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const name = email.slice(0, at);
  return `${name[0]}${"*".repeat(Math.max(3, name.length - 1))}${email.slice(at)}`;
}

function maskPhone(phone: string): string {
  if (phone.length < 6) return "***";
  return `${phone.slice(0, 2)}${"*".repeat(phone.length - 4)}${phone.slice(-2)}`;
}

function maskOrder(order: OrderRecord): OrderRecord {
  return {
    ...order,
    customer: {
      ...order.customer,
      email: maskEmail(order.customer.email),
      phone: maskPhone(order.customer.phone),
    },
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ORDER_ID_RE.test(id)) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order: maskOrder(order) });
}
