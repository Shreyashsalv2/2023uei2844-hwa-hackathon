import { NextRequest, NextResponse } from "next/server";
import { generateOrderId, parseOrderPayload } from "@/lib/orders";
import { saveOrder, storageMode } from "@/lib/store";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20 * 1024;

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Expected Content-Type: application/json." },
      { status: 415, headers: { Allow: "POST" } }
    );
  }

  let bodyText: string;
  try {
    bodyText = await req.text();
  } catch {
    return NextResponse.json(
      { error: "Could not read the request body." },
      { status: 400 }
    );
  }

  if (bodyText.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request body too large." },
      { status: 413 }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON: the request body could not be parsed." },
      { status: 400 }
    );
  }

  const result = parseOrderPayload(payload);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  const order = {
    ...result.order,
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
  };

  try {
    await saveOrder(order);
  } catch {
    return NextResponse.json(
      { error: "We could not save your order right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { orderId: order.id, storage: storageMode(), order },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Method not allowed. Order lists are not exposed. Use POST to create an order or GET /api/orders/{id} to look one up.",
    },
    { status: 405, headers: { Allow: "POST" } }
  );
}
