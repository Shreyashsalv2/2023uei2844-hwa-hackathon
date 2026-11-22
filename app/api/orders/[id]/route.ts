import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/store";

export const runtime = "nodejs";

const ORDER_ID_RE = /^RFL-[A-Z0-9]{6}$/;

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

  return NextResponse.json({ order });
}
