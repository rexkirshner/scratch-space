/**
 * Reorder Project API Route
 * PATCH /api/projects/[id]/reorder
 *
 * @module app/api/projects/[id]/reorder
 * @see PRD Phase 5: Admin CRUD Operations
 * @see PRD Flow 6: Admin Reorders Projects
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { reorderProject } from '@/lib/services/project.service';
import { reorderDirectionSchema } from '@/lib/validations/project.schema';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = reorderDirectionSchema.parse(body.direction);

    // Reorder project
    await reorderProject(params.id, validated);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
