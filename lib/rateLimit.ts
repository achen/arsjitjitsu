/**
 * In-memory rate limiter using sliding window algorithm
 * Can be upgraded to Redis for distributed deployments
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store - per instance (use Redis for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  // Max requests per window
  limit: number;
  // Window size in seconds
  windowSeconds: number;
  // Identifier prefix for different endpoints
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Get a unique identifier for the request
 * Uses IP address, falling back to other identifiers
 */
export function getClientIdentifier(request: Request): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP if there are multiple
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    return vercelForwardedFor;
  }

  // Fallback - in development this might be the same for all requests
  return 'anonymous';
}

/**
 * Check if a request should be rate limited
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowSeconds, prefix = 'default' } = config;
  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = rateLimitStore.get(key);

  // No existing entry or window has expired
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }

  // Within existing window
  if (entry.count < limit) {
    entry.count++;
    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    success: false,
    limit,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

/**
 * Create rate limit headers for the response
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const RATE_LIMITS = {
  // General API: 100 requests per minute
  api: {
    limit: 100,
    windowSeconds: 60,
    prefix: 'api',
  },
  // Auth endpoints: 10 attempts per minute (prevent brute force)
  auth: {
    limit: 10,
    windowSeconds: 60,
    prefix: 'auth',
  },
  // Write operations: 30 per minute
  write: {
    limit: 30,
    windowSeconds: 60,
    prefix: 'write',
  },
  // Heavy reads (techniques list): 20 per minute
  heavyRead: {
    limit: 20,
    windowSeconds: 60,
    prefix: 'heavy',
  },
} as const;
