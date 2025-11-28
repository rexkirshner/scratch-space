/**
 * Password Reset API Endpoint
 * One-time use endpoint to reset admin password
 * IMPORTANT: Delete this file after use!
 *
 * Usage: POST /api/admin/reset-password
 * Body: { "email": "...", "newPassword": "...", "secret": "..." }
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  try {
    const { email, newPassword, secret } = await request.json();

    // Security: Require a secret token from environment variable
    const RESET_SECRET = process.env.PASSWORD_RESET_SECRET;

    if (!RESET_SECRET || secret !== RESET_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid secret' },
        { status: 401 }
      );
    }

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Missing email or newPassword' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash and update password
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: `Password reset successfully for ${email}`,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
