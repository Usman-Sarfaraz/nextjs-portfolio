import type { ContactSubmission } from "./contact";
import { profile } from "./profile";
import { contactEmailIcons } from "./contact-email-icons";

const socials = [
  {
    key: "linkedin",
    label: "LinkedIn",
    url: profile.linkedin,
    color: "#0a66c2",
  },
  { key: "github", label: "GitHub", url: profile.github, color: "#24292f" },
  {
    key: "instagram",
    label: "Instagram",
    url: profile.instagram,
    color: "#c13584",
  },
];
const attachments = Object.entries(contactEmailIcons).map(([key, content]) => ({
  filename: `${key}.png`,
  content: Buffer.from(content, "base64"),
  contentType: "image/png",
  cid: `${key}@portfolio`,
}));
const socialText = socials
  .map(({ label, url }) => `${label}: ${url}`)
  .join("\n");

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character
  );
function layout(
  preview: string,
  eyebrow: string,
  title: string,
  content: string
) {
  const socialLinks = socials
    .map(
      ({ key, label, url, color }) =>
        `<td style="padding:0 16px 12px 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="${color}" style="background:${color};border-radius:9px;padding:9px"><a href="${escape(url)}" aria-label="${label}" style="display:block"><img src="cid:${key}@portfolio" width="20" height="20" alt="${label}" style="display:block;border:0"></a></td><td style="padding-left:8px"><a href="${escape(url)}" style="font-size:12px;color:#065f46;text-decoration:none;font-weight:bold">${label}</a></td></tr></table></td>`
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head><body style="margin:0;background:#f1f4f2;font-family:Arial,Helvetica,sans-serif;color:#162022"><div style="display:none;max-height:0;overflow:hidden">${escape(preview)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #dce5df;border-radius:18px;overflow:hidden"><tr><td style="padding:30px 32px;background:#065f46;color:#ffffff"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle"><p style="margin:0;font-size:20px;font-weight:bold;letter-spacing:-.5px">Usman Sarfraz<span style="color:#a7f3d0">.</span></p><p style="margin:8px 0 0;font-size:12px;line-height:1.6;color:#d1fae5">Frontend development &amp; UI design</p></td><td align="right" width="130" aria-hidden="true" style="vertical-align:middle;font-size:76px;line-height:1;font-weight:bold;letter-spacing:-7px;color:#37836d">US.</td></tr></table></td></tr><tr><td style="padding:32px"><p style="margin:0 0 14px;font-size:11px;letter-spacing:1.5px;color:#065f46;text-transform:uppercase">${escape(eyebrow)}</p><h1 style="margin:0 0 22px;font-size:28px;line-height:1.25;font-weight:normal;letter-spacing:-.7px">${escape(title)}</h1>${content}</td></tr><tr><td style="padding:20px 32px;border-top:1px solid #e5ebe7;color:#6b7470;font-size:11px;line-height:1.8"><p style="margin:0 0 16px;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#526159">Find me elsewhere</p><table role="presentation" cellpadding="0" cellspacing="0"><tr>${socialLinks}</tr></table><p style="margin:8px 0 0">Usman Sarfraz · Lahore, Pakistan<br>This email relates to an enquiry submitted through my portfolio.</p></td></tr></table></td></tr></table></body></html>`;
}
export function contactEmails(data: ContactSubmission, inbox: string) {
  const name = escape(data.name);
  const service = escape(data.service);
  const ownerHtml = layout(
    `New ${data.service} enquiry`,
    "Portfolio enquiry",
    "A new conversation starts here.",
    `<p style="font-size:14px;line-height:1.8;color:#526159"><strong style="color:#162022">${name}</strong> contacted you about <strong>${service}</strong>.</p><table role="presentation" width="100%" style="margin:24px 0;background:#f1f6f3;border-radius:10px"><tr><td style="padding:18px;font-size:13px;line-height:1.9"><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${escape(data.email)}<br><strong>Service:</strong> ${service}</td></tr></table><p style="font-size:11px;color:#065f46;letter-spacing:1px">MESSAGE</p><div style="font-size:14px;line-height:1.85;overflow-wrap:anywhere">${escape(data.message).replace(/\n/g, "<br>")}</div><p style="margin-top:28px;font-size:12px;color:#6b7470">Reply to this email to respond directly to the sender.</p>`
  );
  // Keep the automated reply free of user-supplied message content or links.
  const clientHtml = layout(
    "Thanks for reaching out. Your enquiry has been received.",
    "Message received",
    "Thanks for reaching out.",
    `<p style="font-size:14px;line-height:1.85;color:#526159">Your enquiry about <strong style="color:#065f46">${service}</strong> has reached my inbox. I’ll review it and get back to you personally.</p><p style="font-size:14px;line-height:1.85;color:#526159">Have something to add? Reply to this email and it will come straight to me.</p><p style="margin-top:28px;font-size:14px;line-height:1.8">Best,<br><strong>Usman Sarfraz</strong></p>`
  );
  return {
    owner: {
      to: [inbox],
      reply_to: data.email,
      subject: `New portfolio enquiry: ${data.service}`,
      html: ownerHtml,
      attachments,
      text: `New portfolio enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}\n\nReply directly to the sender.\n\n${socialText}`,
    },
    client: {
      to: [data.email],
      reply_to: inbox,
      subject: "Thanks for reaching out — Usman Sarfraz",
      html: clientHtml,
      attachments,
      text: `Thanks for reaching out.\n\nYour enquiry about ${data.service} has reached my inbox. I'll review it and get back to you personally.\n\nHave something to add? Reply to this email.\n\nBest,\nUsman Sarfraz\n\n${socialText}`,
    },
  };
}
