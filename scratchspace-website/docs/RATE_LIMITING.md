# Rate Limiting Documentation

This document explains how to configure and swap rate limiting implementations in scratchspace.dev.

---

## Current Setup

**Implementation**: Vercel KV (production) / In-Memory (development)

**Configuration**:
- **Max Attempts**: 5 login attempts
- **Time Window**: 15 minutes
- **Scope**: Per IP address
- **Endpoint**: `/api/auth/callback/credentials` (login)

---

## Architecture

The rate limiting system uses a **modular abstraction layer** that makes it easy to swap implementations without changing application code.

### Components

```
src/lib/rate-limit/
├── types.ts              # Interface definitions
├── vercel-kv.ts          # Vercel KV implementation
├── upstash.ts            # Upstash Redis implementation
├── memory.ts             # In-memory implementation
└── index.ts              # Factory and configuration
```

### Interface

All implementations follow the `RateLimiter` interface:

```typescript
interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
  reset?(identifier: string): Promise<void>;
}

interface RateLimitResult {
  success: boolean;    // Request allowed?
  remaining: number;   // Requests remaining
  reset: number;       // Unix timestamp when limit resets
  limit: number;       // Total limit for window
}
```

---

## How to Change Implementation

### Option 1: Edit Configuration (Recommended)

**File**: `src/lib/rate-limit/index.ts`

Change the `implementation` field in `RATE_LIMIT_CONFIG`:

```typescript
export const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 15 * 60,

  // Change this line:
  implementation: 'vercel-kv',  // or 'upstash' or 'memory'
};
```

**That's it!** No other code changes needed.

### Option 2: Environment Variable (Future Enhancement)

Could be enhanced to read from `.env`:

```env
RATE_LIMIT_IMPLEMENTATION=vercel-kv
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_SECONDS=900
```

---

## Available Implementations

### 1. Vercel KV (Current - Production)

**When to use**:
- Deploying to Vercel
- Want simplest setup
- Need automatic scaling
- Want free tier

**Setup**:
1. Deploy to Vercel
2. Vercel automatically provisions KV store
3. No configuration needed

**Pros**:
- ✅ Built into Vercel
- ✅ Free tier: 256MB, 100K requests/month
- ✅ Scales automatically
- ✅ Low latency (edge-based)

**Cons**:
- ❌ Vercel-specific (can't use elsewhere)

**Cost**: $0/month (free tier sufficient for v1)

---

### 2. Upstash Redis (Portable)

**When to use**:
- Need platform independence
- Deploying to AWS/Railway/Fly.io/etc.
- Want persistent rate limiting
- Need horizontal scaling

**Setup**:

1. **Create Upstash Account**:
   - Go to https://upstash.com
   - Create account (free tier available)

2. **Create Redis Database**:
   - Click "Create Database"
   - Choose region closest to your deployment
   - Copy credentials

3. **Add to `.env`**:
   ```env
   UPSTASH_REDIS_URL=https://your-db.upstash.io
   UPSTASH_REDIS_TOKEN=your-token-here
   ```

4. **Update Configuration**:
   ```typescript
   // src/lib/rate-limit/index.ts
   export const RATE_LIMIT_CONFIG: RateLimitConfig = {
     maxRequests: 5,
     windowSeconds: 15 * 60,
     implementation: 'upstash', // Changed from 'vercel-kv'
   };
   ```

5. **Deploy**:
   - Set environment variables in your hosting platform
   - Deploy application
   - Rate limiting now uses Upstash

**Pros**:
- ✅ Works on any platform (portable)
- ✅ Persistent across restarts
- ✅ Scales horizontally
- ✅ Independent of hosting provider

**Cons**:
- ❌ Requires separate account
- ❌ Costs ~$10/month after free tier

**Cost**:
- Free tier: 10K requests/day
- Paid: $10/month for Pro tier

---

### 3. In-Memory (Current - Development)

**When to use**:
- Local development only
- Testing
- Prototyping
- Fallback when other methods unavailable

**Setup**:
```typescript
// src/lib/rate-limit/index.ts
export const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowSeconds: 15 * 60,
  implementation: 'memory',
};
```

**Pros**:
- ✅ No dependencies
- ✅ Simple to understand
- ✅ Works everywhere
- ✅ Free

**Cons**:
- ❌ Resets on server restart
- ❌ Doesn't work across multiple instances
- ❌ Memory leak risk without cleanup
- ❌ Not suitable for production at scale

**Cost**: $0 (no external service)

**⚠️ WARNING**: Only use in development or as fallback. Not production-ready at scale.

---

## Migration Scenarios

### Scenario 1: Vercel → AWS/Railway

**Problem**: Moving off Vercel, but Vercel KV won't work.

**Solution**:

1. **Set up Upstash**:
   ```bash
   # Create Upstash account and database
   # Copy credentials
   ```

2. **Update `.env`**:
   ```env
   UPSTASH_REDIS_URL=https://...
   UPSTASH_REDIS_TOKEN=...
   ```

3. **Update config**:
   ```typescript
   // src/lib/rate-limit/index.ts
   implementation: 'upstash',  // Changed from 'vercel-kv'
   ```

4. **Deploy to new platform**:
   - Set environment variables
   - Deploy code
   - Rate limiting works on new platform

**Time to migrate**: ~30 minutes

---

### Scenario 2: Need Custom Implementation

**Problem**: Have specific requirements (e.g., PostgreSQL-backed rate limiting).

**Solution**:

1. **Create implementation**:
   ```typescript
   // src/lib/rate-limit/postgres.ts
   import type { RateLimiter, RateLimitResult } from './types';

   export class PostgresRateLimiter implements RateLimiter {
     async check(identifier: string): Promise<RateLimitResult> {
       // Your custom logic using PostgreSQL
     }
   }
   ```

2. **Update config**:
   ```typescript
   // src/lib/rate-limit/index.ts
   import { PostgresRateLimiter } from './postgres';

   export const RATE_LIMIT_CONFIG: RateLimitConfig = {
     maxRequests: 5,
     windowSeconds: 15 * 60,
     implementation: 'custom',
     customImplementation: new PostgresRateLimiter(),
   };
   ```

**Time to implement**: 2-4 hours (depending on complexity)

---

## Testing Rate Limiting

### Manual Testing

1. **Start server**:
   ```bash
   npm run dev
   ```

2. **Make 5 login attempts**:
   ```bash
   curl -X POST http://localhost:3002/api/auth/callback/credentials \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@scratchspace.dev","password":"wrong"}'
   ```

3. **6th attempt should return 429**:
   ```json
   {
     "error": "Too many login attempts",
     "message": "Please wait 15 minutes before trying again",
     "retryAfter": 1701234567
   }
   ```

4. **Check response headers**:
   ```
   X-RateLimit-Limit: 5
   X-RateLimit-Remaining: 0
   X-RateLimit-Reset: 1701234567
   Retry-After: 900
   ```

### Automated Testing

Create a test to verify rate limiting works:

```typescript
// tests/integration/rate-limit.test.ts
import { getRateLimiter } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  it('should block after 5 attempts', async () => {
    const limiter = getRateLimiter();
    const ip = '192.168.1.1';

    // Make 5 requests - all should succeed
    for (let i = 0; i < 5; i++) {
      const result = await limiter.check(ip);
      expect(result.success).toBe(true);
    }

    // 6th request should fail
    const result = await limiter.check(ip);
    expect(result.success).toBe(false);
  });
});
```

---

## Configuration Options

### Adjusting Limits

**File**: `src/lib/rate-limit/index.ts`

```typescript
export const RATE_LIMIT_CONFIG: RateLimitConfig = {
  // Change max attempts (currently 5)
  maxRequests: 10,

  // Change time window (currently 15 minutes)
  windowSeconds: 30 * 60,  // 30 minutes

  implementation: 'vercel-kv',
};
```

**Common configurations**:

| Use Case | Max Requests | Window | Notes |
|----------|--------------|--------|-------|
| Strict | 3 | 30 min | High security |
| Default | 5 | 15 min | Recommended |
| Lenient | 10 | 5 min | Development |
| Very Lenient | 20 | 5 min | Testing |

---

## Monitoring

### View Rate Limit Analytics (Vercel KV)

1. Go to Vercel Dashboard
2. Select your project
3. Go to Storage → KV
4. Click on your KV database
5. View analytics tab

Shows:
- Requests per second
- Hit rate
- Storage usage
- Error rate

### View Rate Limit Analytics (Upstash)

1. Go to Upstash Dashboard
2. Select your database
3. View Metrics tab

Shows:
- Commands per second
- Latency
- Storage usage
- Bandwidth

---

## Troubleshooting

### Issue: Rate limiting not working

**Symptom**: Can make unlimited login attempts

**Diagnosis**:
1. Check middleware is running:
   ```bash
   # Add console.log in middleware.ts
   console.log('Rate limit check:', result);
   ```

2. Check environment:
   ```bash
   # Production should use Vercel KV
   echo $NODE_ENV
   ```

3. Check if rate limiter initialized:
   ```bash
   # Should see initialization log
   ```

**Fix**: See error logs for specific issue

---

### Issue: 429 Too Many Requests (false positive)

**Symptom**: Getting rate limited when shouldn't be

**Diagnosis**:
1. Check IP address detection:
   ```typescript
   // In middleware.ts
   console.log('IP:', request.ip);
   ```

2. Check if sharing IP (NAT/VPN):
   - Multiple users behind same IP will share limit

**Fix**:
- Increase `maxRequests` limit
- Use user ID instead of IP (requires auth first)
- Whitelist known IPs

---

### Issue: Rate limiter crashes application

**Symptom**: Server crashes when rate limiter fails

**Diagnosis**:
```typescript
// middleware.ts has try/catch
try {
  const result = await rateLimiter.check(ip);
} catch (error) {
  console.error('Rate limiter error:', error);
  return NextResponse.next(); // Fail open
}
```

**Fix**: Check environment variables are set correctly

---

## Best Practices

### 1. Fail Open, Not Closed

If rate limiter fails, allow the request (fail open):

```typescript
try {
  const result = await rateLimiter.check(ip);
  if (!result.success) {
    return new NextResponse('Rate limited', { status: 429 });
  }
} catch (error) {
  console.error(error);
  return NextResponse.next(); // Allow request despite error
}
```

**Why**: Better UX - don't block legitimate users if rate limiter is down.

### 2. Add Rate Limit Headers

Always include rate limit info in response:

```typescript
response.headers.set('X-RateLimit-Limit', String(result.limit));
response.headers.set('X-RateLimit-Remaining', String(result.remaining));
response.headers.set('X-RateLimit-Reset', String(result.reset));
```

**Why**: Helps clients understand their rate limit status.

### 3. Use IP + User ID for Authenticated Endpoints

For endpoints that require auth, combine IP and user ID:

```typescript
const identifier = `${ip}:${userId}`;
const result = await rateLimiter.check(identifier);
```

**Why**: Prevents attackers from using different IPs for same account.

### 4. Different Limits for Different Endpoints

```typescript
// Login: strict
const loginLimiter = createRateLimiter({
  maxRequests: 5,
  windowSeconds: 15 * 60,
  implementation: 'vercel-kv',
});

// API: lenient
const apiLimiter = createRateLimiter({
  maxRequests: 100,
  windowSeconds: 60,
  implementation: 'vercel-kv',
});
```

---

## Future Enhancements

### 1. Email-based Rate Limiting

Track attempts per email address:

```typescript
const email = request.body.email;
const identifier = `email:${email}`;
const result = await rateLimiter.check(identifier);
```

### 2. Progressive Delays

Increase wait time after repeated attempts:

- 1st failure: Instant retry
- 2nd failure: 1 minute wait
- 3rd failure: 5 minutes wait
- 4th failure: 15 minutes wait
- 5th failure: 1 hour wait

### 3. CAPTCHA After Threshold

Show CAPTCHA after 3 failed attempts, block after 10.

### 4. Admin Override

Allow admins to reset rate limits:

```typescript
// Admin endpoint
POST /api/admin/rate-limit/reset
{ "ip": "192.168.1.1" }
```

---

## Summary

**Current Setup**: Vercel KV (production), In-Memory (development)

**To Change**: Edit one line in `src/lib/rate-limit/index.ts`

**Migration Time**: < 30 minutes to any other implementation

**Zero Code Changes**: Application code doesn't need to know about implementation details

**Production Ready**: ✅ Deployed with rate limiting protection

---

**Last Updated**: 2025-11-27
**Version**: 1.0
**Owner**: Rex Kirshner / RBK Strategies
