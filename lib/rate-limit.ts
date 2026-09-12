type WindowState = { startedAt: number; count: number };

const globalRateLimits = globalThis as typeof globalThis & {
  rallyBuddyLimits?: Map<string, WindowState>;
};

const buckets = globalRateLimits.rallyBuddyLimits ?? new Map<string, WindowState>();
if (process.env.NODE_ENV !== "production") globalRateLimits.rallyBuddyLimits = buckets;

export function takeRateLimit(
  key: string,
  limit = 6,
  windowMs = 60_000,
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(key);
  const state = !current || now - current.startedAt >= windowMs
    ? { startedAt: now, count: 0 }
    : current;

  if (state.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - state.startedAt)) / 1000)),
    };
  }

  state.count += 1;
  buckets.set(key, state);
  return {
    allowed: true,
    remaining: limit - state.count,
    retryAfterSeconds: 0,
  };
}
