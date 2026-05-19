import "server-only";

import { createHash } from "node:crypto";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

function now() {
  return Date.now();
}

function cleanupExpiredBuckets(currentTime: number) {
  if (buckets.size < 500) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= currentTime) {
      buckets.delete(key);
    }
  }
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return realIp?.trim() || "unknown";
}

export function fingerprintRateLimitPart(value: string | null | undefined) {
  return createHash("sha256")
    .update(value?.trim() || "missing")
    .digest("hex")
    .slice(0, 24);
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const currentTime = now();
  cleanupExpiredBuckets(currentTime);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= currentTime) {
    buckets.set(key, {
      count: 1,
      resetAt: currentTime + windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - currentTime) / 1000),
      ),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    retryAfterSeconds: 0,
  };
}

export function checkAuditRequestRateLimit(request: Request) {
  const ip = getRequestIp(request);

  return checkRateLimit({
    key: `audit-request:${ip}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
}

export function checkInternalPatchRateLimit(request: Request, scope: string) {
  const ip = getRequestIp(request);
  const keyFingerprint = fingerprintRateLimitPart(
    request.headers.get("x-flowops-internal-key"),
  );

  return checkRateLimit({
    key: `internal-patch:${scope}:${ip}:${keyFingerprint}`,
    limit: 60,
    windowMs: 10 * 60 * 1000,
  });
}
