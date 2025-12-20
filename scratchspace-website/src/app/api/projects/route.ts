/**
 * Projects API Route
 * POST /api/projects
 *
 * @module app/api/projects
 * @see PRD Phase 5: Admin CRUD Operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { createProject } from '@/lib/services/project.service';
import { createProjectSchema } from '@/lib/validations/project.schema';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = createProjectSchema.parse(body);

    // Create project
    const project = await createProject(validated);

    return NextResponse.json(project, { status: 201 });
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
