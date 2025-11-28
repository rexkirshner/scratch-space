/**
 * Admin Settings Page
 * Update email and password
 *
 * @module app/(authenticated)/admin/settings/page
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { prisma } from '@/lib/db/prisma';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Account Settings',
  description:
    'Update your account email and password for scratchspace.dev admin access.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Get current user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">
          Update your account email and password
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
        <SettingsForm user={user} />
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-900/30 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Security Note:</strong> Changing your password will not sign
          you out of your current session. You&apos;ll need to use your new
          password the next time you sign in.
        </p>
      </div>
    </div>
  );
}
