import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()-]{7,20}$/;

function sanitizeSingleLine(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMultiLine(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const singleLine = (min: number, max: number) =>
  z.preprocess(sanitizeSingleLine, z.string().min(min).max(max));

export const leadSchema = z.object({
  name: singleLine(2, 100),
  company: singleLine(2, 120),
  businessType: singleLine(2, 80),
  revenueRange: singleLine(2, 60),
  problemDescription: z.preprocess(
    sanitizeMultiLine,
    z.string().min(20).max(3000),
  ),
  email: z
    .preprocess(sanitizeSingleLine, z.string().toLowerCase())
    .refine((value) => EMAIL_REGEX.test(value), "Invalid email address"),
  whatsapp: z
    .preprocess(sanitizeSingleLine, z.string())
    .refine((value) => PHONE_REGEX.test(value), "Invalid WhatsApp number"),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export type LeadFieldErrors = Partial<
  Record<keyof LeadPayload, string[] | undefined>
>;

export function getLeadFieldErrors(error: z.ZodError): LeadFieldErrors {
  return error.flatten().fieldErrors as LeadFieldErrors;
}

export function toWhatsAppUrl(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) {
    return "https://wa.me";
  }
  return `https://wa.me/${digits}`;
}
