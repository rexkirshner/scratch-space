/**
 * NextAuth Configuration
 * Handles authentication with email/password credentials
 *
 * @module lib/auth/auth.config
 * @see PRD Phase 1: Database & Auth Foundation
 */

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword } from './password';

/**
 * NextAuth configuration options
 * - Uses Credentials provider for email/password auth
 * - Session strategy: JWT (7-day expiry)
 * - Custom pages for sign in
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@scratchspace.dev',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // Return null for invalid credentials (don't reveal if email exists)
          return null;
        }

        // Verify password
        const isValidPassword = await verifyPassword(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        // Return user object (will be encoded in JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token on sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data from token to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
