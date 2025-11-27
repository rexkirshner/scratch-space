/**
 * Upstash Redis Rate Limiter Implementation
 * Standalone Upstash Redis for platform-agnostic rate limiting
 *
 * Use this if you need:
 * - Portability (not tied to Vercel)
 * - Horizontal scaling across multiple instances
 * - Persistent rate limiting across restarts
 *
 * Setup:
 * 1. Create account at https://upstash.com
 * 2. Create Redis database
 * 3. Add UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN to .env
 *
 * @module lib/rate-limit/upstash
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { RateLimiter, RateLimitResult, RateLimitConfig } from './types';

export class UpstashRateLimiter implements RateLimiter {
  private ratelimit: Ratelimit;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Validate environment variables
    if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
      throw new Error(
        'Upstash Redis credentials missing. Set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN in .env'
      );
    }

    // Create Redis client
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });

    // Create sliding window rate limiter
    this.ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        config.maxRequests,
        `${config.windowSeconds} s`
      ),
      analytics: true,
      prefix: '@ratelimit:',
    });
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const result = await this.ratelimit.limit(identifier);

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  }

  async reset(identifier: string): Promise<void> {
    // Reset by using the Ratelimit reset method if available
    // Otherwise, we'd need direct Redis access which is already in the Ratelimit instance
    // For now, document this limitation
    console.warn('Reset not implemented for Upstash rate limiter');
  }
}
