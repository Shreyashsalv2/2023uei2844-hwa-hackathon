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
      {
        error: "validation failed",
        fields: { body: "malformed JSON: the request body could not be parsed" },
      },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      {
        error: "validation failed",
        fields: { body: "request body must be a JSON object" },
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = body as Record<string, unknown>;
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanSubject = typeof subject === "string" ? subject.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  const fields: Record<string, string> = {};
  if (cleanName.length < 2 || cleanName.length > 80) {
    fields["name"] = "enter your name (2–80 characters)";
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    fields["email"] = "invalid email";
  }
  if (cleanSubject.length < 2 || cleanSubject.length > 120) {
    fields["subject"] = "enter a subject (2–120 characters)";
  }
  if (cleanMessage.length < 10 || cleanMessage.length > 2000) {
    fields["message"] = "enter a message of at least 10 characters";
  }
  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "validation failed", fields },
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
