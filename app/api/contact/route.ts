import { createHash } from "node:crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { validateContact } from "../../../lib/contact";
import { contactEmails } from "../../../lib/contact-emails";
import { profile } from "../../../lib/profile";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();
function limited(key: string) {
  const now = Date.now();
  for (const [id, entry] of attempts)
    if (entry.expires <= now) attempts.delete(id);
  const entry = attempts.get(key);
  if (entry && entry.count >= 3) return true;
  if (!entry && attempts.size >= 10000) return true;
  attempts.set(key, {
    count: (entry?.count ?? 0) + 1,
    expires: entry?.expires ?? now + 60000,
  });
  return false;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Please submit from the portfolio contact form." },
      { status: 403 }
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Invalid request format." },
      { status: 415 }
    );
  const body = await request.text();
  if (body.length > 24000)
    return NextResponse.json(
      { error: "Your message is too long." },
      { status: 413 }
    );
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const data = validateContact(input);
  if (!data)
    return NextResponse.json(
      { error: "Please enter a valid name, email, service, and message." },
      { status: 400 }
    );
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const inbox = process.env.CONTACT_TO_EMAIL || profile.email;
  if (!user || !password)
    return NextResponse.json(
      {
        error: "The form is temporarily unavailable. Please email me directly.",
      },
      { status: 503 }
    );
  // Instance-local throttling. Add a shared limit or hosting firewall for distributed deployments.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const emailKey = createHash("sha256").update(data.email).digest("hex");
  if (limited(`ip:${ip}`) || limited(`email:${emailKey}`))
    return NextResponse.json(
      { error: "Please wait a minute before sending another message." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  const templates = contactEmails(data, inbox);
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  async function send(kind: "owner" | "client") {
    const { reply_to, ...template } = templates[kind];
    const result = await transport.sendMail({
      from: { name: "Usman Sarfraz", address: user! },
      ...template,
      replyTo: reply_to,
    });
    if (!result.accepted?.length) throw new Error("Email was not accepted.");
  }
  try {
    await send("owner");
  } catch (error) {
    const smtp = error as { code?: string; responseCode?: number };
    // Log only diagnostic codes; SMTP messages may contain personal details.
    console.error("Contact SMTP failed", {
      code: smtp?.code,
      responseCode: smtp?.responseCode,
    });
    return NextResponse.json(
      {
        error:
          "Your message could not be sent. Please try again or email me directly.",
      },
      { status: 502 }
    );
  }
  let confirmationSent = true;
  try {
    await send("client");
  } catch {
    confirmationSent = false;
    console.error(
      "Contact confirmation email failed after enquiry was accepted."
    );
  }
  return NextResponse.json({ success: true, confirmationSent });
}
