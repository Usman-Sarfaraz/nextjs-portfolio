import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const { randomUUID } = require("node:crypto");
require.extensions[".ts"] = (module, file) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
    file
  );
const nodemailer = require("nodemailer");
const { POST } = require("../app/api/contact/route.ts");
const { contactEmails } = require("../lib/contact-emails.ts");
const { validateContact } = require("../lib/contact.ts");
const valid = () => ({
  name: "Client",
  email: `${randomUUID()}@example.com`,
  service: "Frontend development",
  message: "Hello <script>alert(1)</script>\nProject details",
  requestId: randomUUID(),
});
function request(
  data,
  ip = randomUUID(),
  origin = "https://portfolio.example"
) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(data),
  });
}
test("contact validation and escaped email templates", () => {
  const data = valid();
  assert.ok(validateContact(data));
  for (const change of [
    { email: "bad" },
    { service: "unknown" },
    { name: "bad\r\nheader" },
    { message: "" },
  ])
    assert.equal(validateContact({ ...data, ...change }), null);
  const emails = contactEmails(data, "owner@example.com");
  assert.ok(emails.owner.html.includes("&lt;script&gt;"));
  for (const template of [emails.owner, emails.client]) {
    assert.ok(template.html.includes("US."));
    assert.ok(template.html.includes('href="https://github.com/Usman-Sarfaraz"'));
    assert.ok(template.html.includes('href="https://www.instagram.com/osman.sarfraz_/"'));
    assert.equal(template.attachments.length, 3);
    for (const attachment of template.attachments) {
      assert.ok(template.html.includes(`cid:${attachment.cid}`));
      assert.equal(attachment.content.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    }
  }
  assert.ok(!emails.owner.html.includes("<script>"));
  assert.ok(!emails.client.html.includes("alert(1)"));
  assert.equal(emails.owner.reply_to, data.email);
});
test("Gmail route delivery and failure handling", async (t) => {
  const old = nodemailer.createTransport;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  t.after(() => {
    nodemailer.createTransport = old;
    if (user === undefined) delete process.env.GMAIL_USER;
    else process.env.GMAIL_USER = user;
    if (pass === undefined) delete process.env.GMAIL_APP_PASSWORD;
    else process.env.GMAIL_APP_PASSWORD = pass;
  });
  delete process.env.GMAIL_USER;
  delete process.env.GMAIL_APP_PASSWORD;
  assert.equal((await POST(request(valid()))).status, 503);
  process.env.GMAIL_USER = "owner@gmail.com";
  process.env.GMAIL_APP_PASSWORD = "test password";
  let sent = [];
  nodemailer.createTransport = (options) => {
    assert.equal(options.host, "smtp.gmail.com");
    assert.equal(options.secure, true);
    return {
      sendMail: async (mail) => {
        sent.push(mail);
        return { accepted: mail.to };
      },
    };
  };
  const data = valid();
  let response = await POST(request(data));
  assert.deepEqual(await response.json(), {
    success: true,
    confirmationSent: true,
  });
  assert.equal(sent.length, 2);
  assert.equal(sent[0].replyTo, data.email);
  assert.deepEqual(sent[1].to, [data.email]);
  assert.equal(sent[0].from.address, "owner@gmail.com");
  sent = [];
  assert.equal(
    (await POST(request({ ...valid(), email: "invalid" }))).status,
    400
  );
  assert.equal(sent.length, 0);
  assert.equal(
    (await POST(request(valid(), randomUUID(), "https://other.example")))
      .status,
    403
  );
  assert.equal(
    (await POST(request({ ...valid(), website: "https://autofilled.example" }))).status,
    200
  );
  nodemailer.createTransport = () => ({
    sendMail: async () => {
      throw new Error("SMTP failure");
    },
  });
  assert.equal((await POST(request(valid()))).status, 502);
  let calls = 0;
  const oldError = console.error;
  console.error = () => {};
  try {
    nodemailer.createTransport = () => ({
      sendMail: async (mail) => {
        if (++calls === 2) throw new Error("Confirmation failure");
        return { accepted: mail.to };
      },
    });
    response = await POST(request(valid()));
    assert.deepEqual(await response.json(), {
      success: true,
      confirmationSent: false,
    });
  } finally {
    console.error = oldError;
  }
  nodemailer.createTransport = () => ({
    sendMail: async (mail) => ({ accepted: mail.to }),
  });
  const ip = randomUUID();
  for (let i = 0; i < 3; i++)
    assert.equal((await POST(request(valid(), ip))).status, 200);
  assert.equal((await POST(request(valid(), ip))).status, 429);
});
