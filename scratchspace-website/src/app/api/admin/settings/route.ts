/**
 * Admin Settings API
 * Update email and password
 *
 * @module app/api/admin/settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    // Handle email update
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: 'Email already in use' },
          { status: 400 }
        );
      }

      // Update email
      await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });

      return NextResponse.json({
        message: 'Email updated successfully',
        email,
      });
    }

    // Handle password update
    if (currentPassword && newPassword) {
      // Verify current password
      const isValid = await verifyPassword(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Validate new password strength
      if (newPassword.length < 12) {
        return NextResponse.json(
          { message: 'Password must be at least 12 characters' },
          { status: 400 }
        );
      }

      // Hash new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      return NextResponse.json({
        message: 'Password updated successfully',
      });
    }

    return NextResponse.json(
      { message: 'No valid update fields provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
