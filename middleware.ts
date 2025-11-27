/**
 * Next.js Middleware for Auth Protection
 * Protects /admin routes - requires authentication
 *
 * @see PRD Phase 1: Auth middleware for protected routes
 */

export { default } from 'next-auth/middleware';

/**
 * Matcher configuration
 * Protects /admin and all routes under /admin/*
 */
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
