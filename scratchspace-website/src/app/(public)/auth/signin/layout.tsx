/**
 * Sign In Layout
 * Provides metadata for the sign-in page
 *
 * @module app/(public)/auth/signin/layout
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Sign In',
  description: 'Sign in to access the scratchspace.dev admin dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
