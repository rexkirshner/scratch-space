/**
 * Next.js Middleware
 * 1. Rate limiting on login endpoint
 * 2. Auth protection for /admin routes
 *
 * @see PRD Phase 1: Auth middleware for protected routes
 * @see Code Review: Rate limiting on login endpoint (CRITICAL)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Rate Limiter Import
 *
 * Note: We import this conditionally to handle environments where
 * Vercel KV might not be available (local development).
 *
 * In production, uses Vercel KV.
 * In development, uses in-memory fallback.
 */
import { getRateLimiter } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================================================
  // 1. Rate Limiting for Login Endpoint
  // ============================================================================

  if (pathname === '/api/auth/callback/credentials') {
    try {
      // Get rate limiter instance (singleton)
      const rateLimiter = getRateLimiter();

      // Use IP address as identifier (fallback to 127.0.0.1 for local dev)
      // Note: request.ip is available in edge runtime but not in type definitions
      const ip = (request as NextRequest & { ip?: string }).ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

      // Check rate limit
      const result = await rateLimiter.check(ip);

      if (!result.success) {
        // Rate limit exceeded
        return new NextResponse(
          JSON.stringify({
            error: 'Too many login attempts',
            message: 'Please wait 15 minutes before trying again',
            retryAfter: result.reset,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(result.reset - Math.floor(Date.now() / 1000)),
              'X-RateLimit-Limit': String(result.limit),
              'X-RateLimit-Remaining': String(result.remaining),
              'X-RateLimit-Reset': String(result.reset),
            },
          }
        );
      }

      // Rate limit OK - add headers and continue
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', String(result.limit));
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
      response.headers.set('X-RateLimit-Reset', String(result.reset));
      return response;
    } catch (error) {
      // Log error but don't block request if rate limiter fails
      console.error('Rate limiter error:', error);
      // Continue to allow request (fail open, not fail closed)
      return NextResponse.next();
    }
  }

  // ============================================================================
  // 2. Auth Protection for /admin Routes
  // ============================================================================

  if (pathname.startsWith('/admin')) {
    // Check if user has valid session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Not authenticated - redirect to signin
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Authenticated - allow request
    return NextResponse.next();
  }

  // ============================================================================
  // 3. Allow All Other Requests
  // ============================================================================

  return NextResponse.next();
}

/**
 * Matcher configuration
 * Run middleware for:
 * - Login endpoint (for rate limiting)
 * - /admin routes (for auth protection)
 */
export const config = {
  matcher: [
    '/api/auth/callback/credentials',
    '/admin',
    '/admin/:path*',
  ],
};
