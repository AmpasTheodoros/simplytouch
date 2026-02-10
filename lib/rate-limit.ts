import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Create a rate limiter instance.
 * Falls back to no-op if Upstash env vars are not set (development).
 */
function createRateLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Return a no-op limiter for development
    return {
      limit: async (_identifier: string) => ({
        success: true,
        limit: 0,
        remaining: 0,
        reset: 0,
      }),
    };
  }

  const redis = new Redis({ url, token });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "simplytouch:ratelimit",
  });
}

export const rateLimiter = createRateLimiter();

/**
 * Create a custom rate limiter with specific limits.
 */
export function createCustomLimiter(requests: number, window: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return {
      limit: async (_identifier: string) => ({
        success: true,
        limit: 0,
        remaining: 0,
        reset: 0,
      }),
    };
  }

  const redis = new Redis({ url, token });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: true,
    prefix: `simplytouch:ratelimit:custom`,
  });
}
