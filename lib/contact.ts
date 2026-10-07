export const CONTACT_SERVICES = [
  "Frontend development",
  "UI design & development",
  "Backend development",
  "Something else",
] as const;
export type ContactSubmission = {
  name: string;
  email: string;
  service: string;
  message: string;
  requestId: string;
};

export function validateContact(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (
    !["name", "email", "service", "message", "requestId"].every(
      (key) => typeof input[key] === "string"
    )
  )
    return null;
  const name = (input.name as string).trim();
  const email = (input.email as string).trim().toLowerCase();
  const service = input.service as string;
  const message = (input.message as string).trim();
  const requestId = input.requestId as string;
  if (
    !name ||
    name.length > 100 ||
    /[\r\n\x00-\x1f]/.test(name) ||
    email.length > 254 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(
      email
    ) ||
    !CONTACT_SERVICES.some((item) => item === service) ||
    !message ||
    message.length > 4000 ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      requestId
    )
  )
    return null;
  return { name, email, service, message, requestId };
}
