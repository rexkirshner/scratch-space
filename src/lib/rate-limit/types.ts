/**
 * Rate Limiter Interface
 * Abstraction layer for rate limiting implementations
 *
 * This interface allows easy swapping between different rate limiting backends:
 * - Vercel KV (current)
 * - Upstash Redis (portable)
 * - In-memory (development/fallback)
 * - Custom implementations
 *
 * @module lib/rate-limit/types
 */

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean;

  /**
   * Number of requests remaining in current window
   */
  remaining: number;

  /**
   * Unix timestamp when the limit resets
   */
  reset: number;

  /**
   * Total limit for the time window
   */
  limit: number;
}

export interface RateLimiter {
  /**
   * Check if a request should be allowed
   *
   * @param identifier - Unique identifier (usually IP address or user ID)
   * @returns Rate limit result
   */
  check(identifier: string): Promise<RateLimitResult>;

  /**
   * Reset rate limit for an identifier
   * Useful for testing or manual overrides
   *
   * @param identifier - Unique identifier to reset
   */
  reset?(identifier: string): Promise<void>;
}

export type RateLimitConfig = {
  /**
   * Maximum number of requests allowed
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Implementation to use
   */
  implementation: 'vercel-kv' | 'upstash' | 'memory' | 'custom';

  /**
   * Custom implementation (if implementation === 'custom')
   */
  customImplementation?: RateLimiter;
};
