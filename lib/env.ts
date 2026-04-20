import "server-only";

import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),
  GOOGLE_SHEETS_CREDENTIALS: z.string().min(1),
  EMAIL_SERVICE_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email().default("no-reply@flowops.agency"),
  SITE_URL: z.string().url().default("https://flowops.agency"),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid server environment configuration: ${details}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
