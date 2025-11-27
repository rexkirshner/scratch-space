/**
 * Rate Limiter Factory
 * Centralized configuration and implementation selection
 *
 * To change implementation, update RATE_LIMIT_CONFIG below:
 * - 'vercel-kv' → Vercel's KV store (current, recommended for Vercel)
 * - 'upstash' → Standalone Upstash Redis (portable, requires account)
 * - 'memory' → In-memory (development/testing only)
 * - 'custom' → Your own implementation
 *
 * @module lib/rate-limit
 */

import type { RateLimitConfig, RateLimiter } from './types';
import { VercelKVRateLimiter } from './vercel-kv';
import { UpstashRateLimiter } from './upstash';
import { MemoryRateLimiter } from './memory';

/**
 * Rate Limiting Configuration
 *
 * 🔧 TO CHANGE IMPLEMENTATION:
 * Change the 'implementation' field below and restart the server.
 *
 * No other code changes needed!
 */
export const RATE_LIMIT_CONFIG: RateLimitConfig = {
  /**
   * Maximum login attempts allowed
   */
  maxRequests: 5,

  /**
   * Time window in seconds (15 minutes = 900 seconds)
   */
  windowSeconds: 15 * 60,

  /**
   * Implementation to use:
   *
   * - 'vercel-kv': Vercel's built-in KV store
   *   ✅ Best for Vercel deployments
   *   ✅ Free tier: 256MB, 100K requests/month
   *   ✅ Scales automatically
   *   ❌ Vercel-specific
   *
   * - 'upstash': Standalone Upstash Redis
   *   ✅ Platform-agnostic (works anywhere)
   *   ✅ Scales horizontally
   *   ❌ Requires account setup
   *   ❌ Costs ~$10/month
   *
   * - 'memory': In-memory storage
   *   ✅ Simple, no dependencies
   *   ✅ Good for development
   *   ❌ Resets on restart
   *   ❌ Doesn't scale across instances
   *
   * To switch: Change the value below and redeploy
   */
  implementation: (process.env.NODE_ENV === 'production' ? 'vercel-kv' : 'memory'),
};

/**
 * Create rate limiter instance
 *
 * This function selects the appropriate implementation based on config.
 * The returned instance implements the RateLimiter interface, so your
 * code doesn't need to know which implementation is being used.
 *
 * @param config - Rate limit configuration (defaults to RATE_LIMIT_CONFIG)
 * @returns Rate limiter instance
 */
export function createRateLimiter(
  config: RateLimitConfig = RATE_LIMIT_CONFIG
): RateLimiter {
  switch (config.implementation) {
    case 'vercel-kv':
      return new VercelKVRateLimiter(config);

    case 'upstash':
      return new UpstashRateLimiter(config);

    case 'memory':
      return new MemoryRateLimiter(config);

    case 'custom':
      if (!config.customImplementation) {
        throw new Error(
          'Custom implementation specified but customImplementation not provided'
        );
      }
      return config.customImplementation;

    default:
      throw new Error(`Unknown rate limit implementation: ${config.implementation}`);
  }
}

/**
 * Singleton rate limiter instance
 *
 * This ensures we only create one rate limiter instance across the application.
 * Particularly important for in-memory implementation to share state.
 */
let rateLimiterInstance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = createRateLimiter();
  }
  return rateLimiterInstance;
}

// Export types and implementations for advanced use cases
export type { RateLimiter, RateLimitResult, RateLimitConfig } from './types';
export { VercelKVRateLimiter } from './vercel-kv';
export { UpstashRateLimiter } from './upstash';
export { MemoryRateLimiter } from './memory';
