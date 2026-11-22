import { NextRequest, NextResponse } from "next/server";
import { saveOrder } from "@/lib/store";
import type { OrderRecord } from "@/lib/orders";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface StoredMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

function ticketId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `CT-${[...bytes].map((b) => alphabet[b % alphabet.length]).join("")}`;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Expected Content-Type: application/json." },
      { status: 415 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON: the request body could not be parsed." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = body as Record<string, unknown>;
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanSubject = typeof subject === "string" ? subject.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  if (cleanName.length < 2 || cleanName.length > 80) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (cleanSubject.length < 2 || cleanSubject.length > 120) {
    return NextResponse.json({ error: "Please enter a subject." }, { status: 400 });
  }
  if (cleanMessage.length < 10 || cleanMessage.length > 2000) {
    return NextResponse.json(
      { error: "Please enter a message of at least 10 characters." },
      { status: 400 }
    );
  }

  const record: StoredMessage = {
    id: ticketId(),
    createdAt: new Date().toISOString(),
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
  };

  try {
    await saveOrder(record as unknown as OrderRecord);
  } catch {
    return NextResponse.json(
      { error: "We could not save your message right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ticketId: record.id }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
