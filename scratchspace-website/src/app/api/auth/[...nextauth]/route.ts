/**
 * NextAuth API Route Handler
 * Handles all auth routes: /api/auth/signin, /api/auth/signout, etc.
 *
 * @see src/lib/auth/auth.config.ts for configuration
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
