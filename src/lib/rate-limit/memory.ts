/**
 * In-Memory Rate Limiter Implementation
 * Simple in-memory rate limiter for development and fallback
 *
 * ⚠️ WARNING: This implementation:
 * - Resets on server restart
 * - Doesn't work across multiple instances
 * - Not suitable for production at scale
 *
 * Use this for:
 * - Local development
 * - Testing
 * - Fallback when Vercel KV is unavailable
 *
 * @module lib/rate-limit/memory
 */

import type { RateLimiter, RateLimitResult, RateLimitConfig } from './types';

interface MemoryRecord {
  timestamps: number[];
}

export class MemoryRateLimiter implements RateLimiter {
  private store: Map<string, MemoryRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Cleanup old entries every 5 minutes to prevent memory leak
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = this.config.windowSeconds * 1000;
    const windowStart = now - windowMs;

    // Get or create record
    let record = this.store.get(identifier);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(identifier, record);
    }

    // Remove timestamps outside current window
    record.timestamps = record.timestamps.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if limit exceeded
    const currentCount = record.timestamps.length;
    const success = currentCount < this.config.maxRequests;

    // Add current timestamp if allowed
    if (success) {
      record.timestamps.push(now);
    }

    // Calculate reset time (end of current window)
    const oldestTimestamp = record.timestamps[0] || now;
    const reset = Math.floor((oldestTimestamp + windowMs) / 1000);

    return {
      success,
      remaining: Math.max(0, this.config.maxRequests - currentCount - (success ? 1 : 0)),
      reset,
      limit: this.config.maxRequests,
    };
  }

  async reset(identifier: string): Promise<void> {
    this.store.delete(identifier);
  }

  /**
   * Cleanup expired entries to prevent memory leak
   */
  private cleanup(): void {
    const now = Date.now();
    const windowMs = this.config.windowSeconds * 1000;
    const expiredBefore = now - windowMs;

    for (const [identifier, record] of this.store.entries()) {
      // Remove timestamps outside window
      record.timestamps = record.timestamps.filter(
        (timestamp) => timestamp > expiredBefore
      );

      // Delete entry if no timestamps remain
      if (record.timestamps.length === 0) {
        this.store.delete(identifier);
      }
    }
  }

  /**
   * Get current store size (for debugging)
   */
  getStoreSize(): number {
    return this.store.size;
  }
}
