/**
 * List Users API Endpoint
 * One-time use endpoint to see what users exist in production
 * IMPORTANT: Delete this file after use!
 *
 * Usage: GET /api/admin/list-users?secret=...
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Security: Require a secret token from environment variable
    const RESET_SECRET = process.env.PASSWORD_RESET_SECRET;

    if (!RESET_SECRET || secret !== RESET_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid secret' },
        { status: 401 }
      );
    }

    // Get all users (email and name only, no passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
