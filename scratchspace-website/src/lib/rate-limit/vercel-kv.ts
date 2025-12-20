/**
 * Vercel KV Rate Limiter Implementation
 * Uses Vercel's built-in Redis-compatible KV store
 *
 * @module lib/rate-limit/vercel-kv
 * @see https://vercel.com/docs/storage/vercel-kv
 */

import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import type { RateLimiter, RateLimitResult, RateLimitConfig } from './types';

export class VercelKVRateLimiter implements RateLimiter {
  private ratelimit: Ratelimit;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Create sliding window rate limiter
    // Sliding window is more accurate than fixed window
    this.ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(
        config.maxRequests,
        `${config.windowSeconds} s`
      ),
      analytics: true, // Enable analytics for debugging
      prefix: '@ratelimit:', // Prefix for Redis keys
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
    // Reset by deleting the key
    // Note: This is a manual operation, use sparingly
    await kv.del(`@ratelimit:${identifier}`);
  }
}
