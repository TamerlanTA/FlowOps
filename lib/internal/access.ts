import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

const DEV_FALLBACK_KEY = "flowops-dev-internal";
const MIN_PRODUCTION_KEY_LENGTH = 16;

function safeCompare(left: string, right: string) {
  const leftBuffer = createHash("sha256").update(left).digest();
  const rightBuffer = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function normalizeKey(value: string | null | undefined) {
  return value?.trim() || "";
}

export function getInternalAccessKeyStatus() {
  const configuredKey = normalizeKey(process.env.FLOWOPS_INTERNAL_ACCESS_KEY);
  const isProduction = process.env.NODE_ENV === "production";

  return {
    configured: Boolean(configuredKey),
    isProduction,
    devFallbackAllowed: !isProduction && !configuredKey,
    devFallbackKey: DEV_FALLBACK_KEY,
    productionKeyTooShort:
      isProduction &&
      Boolean(configuredKey) &&
      configuredKey.length < MIN_PRODUCTION_KEY_LENGTH,
  };
}

export function validateInternalAccessKey(providedKey: string | null | undefined) {
  const key = normalizeKey(providedKey);

  if (!key) {
    return false;
  }

  const configuredKey = normalizeKey(process.env.FLOWOPS_INTERNAL_ACCESS_KEY);

  if (configuredKey) {
    if (
      process.env.NODE_ENV === "production" &&
      configuredKey.length < MIN_PRODUCTION_KEY_LENGTH
    ) {
      return false;
    }

    return safeCompare(key, configuredKey);
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return safeCompare(key, DEV_FALLBACK_KEY);
}
