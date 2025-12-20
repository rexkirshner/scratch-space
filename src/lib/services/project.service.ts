/**
 * Project Service - CRUD operations for projects
 * Handles all database operations for Project model
 *
 * @module lib/services/project.service
 * @see PRD Phase 2: Data Access Layer
 */

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import {
  createProjectSchema,
  updateProjectSchema,
  reorderDirectionSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ReorderDirection,
} from '@/lib/validations/project.schema';
import type { Project } from '@prisma/client';

/**
 * Get all PUBLIC projects, ordered by manual order (ASC)
 * Used for landing page display
 *
 * @returns Promise<Project[]> - Array of public projects
 */
export async function getPublicProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    orderBy: {
      order: 'asc',
    },
  });
}

/**
 * Get ALL projects (public + private), ordered by manual order
 * Used for admin dashboard
 *
 * @returns Promise<Project[]> - Array of all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: {
      order: 'asc',
    },
  });
}

/**
 * Get a single project by ID
 *
 * @param id - Project ID
 * @returns Promise<Project | null>
 */
export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { id },
  });
}

/**
 * Create a new project
 * Validates input and assigns next available order number
 *
 * @param data - Project data
 * @returns Promise<Project> - Created project
 * @throws Error if validation fails
 */
export async function createProject(
  data: CreateProjectInput
): Promise<Project> {
  // Validate input
  const validated = createProjectSchema.parse(data);

  // Get highest order number
  const highestOrder = await prisma.project.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const nextOrder = (highestOrder?.order ?? -1) + 1;

  // Create project
  const project = await prisma.project.create({
    data: {
      name: validated.name,
      url: validated.url,
      description: validated.description,
      githubUrl: validated.githubUrl || null,
      visibility: validated.visibility,
      order: nextOrder,
    },
  });

  // Invalidate landing page cache
  revalidatePath('/');

  return project;
}

/**
 * Update an existing project
 * Validates input and updates only provided fields
 *
 * @param id - Project ID
 * @param data - Partial project data
 * @returns Promise<Project> - Updated project
 * @throws Error if validation fails or project not found
 */
export async function updateProject(
  id: string,
  data: UpdateProjectInput
): Promise<Project> {
  // Validate input
  const validated = updateProjectSchema.parse(data);

  try {
    // Update project (Prisma throws P2025 if not found)
    const project = await prisma.project.update({
      where: { id },
      data: validated,
    });

    // Invalidate landing page cache
    revalidatePath('/');

    return project;
  } catch (error) {
    // Handle "Record not found" error
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      throw new Error(`Project not found: ${id}`);
    }
    throw error;
  }
}

/**
 * Delete a project (hard delete)
 * Permanently removes project from database
 *
 * @param id - Project ID
 * @returns Promise<Project> - Deleted project
 * @throws Error if project not found
 */
export async function deleteProject(id: string): Promise<Project> {
  try {
    // Delete project (Prisma throws P2025 if not found)
    const project = await prisma.project.delete({
      where: { id },
    });

    // Invalidate landing page cache
    revalidatePath('/');

    return project;
  } catch (error) {
    // Handle "Record not found" error
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      throw new Error(`Project not found: ${id}`);
    }
    throw error;
  }
}

/**
 * Reorder a project (move up or down)
 * Swaps order value with adjacent project
 *
 * @param id - Project ID to move
 * @param direction - 'up' or 'down'
 * @returns Promise<void>
 * @throws Error if project not found or already at boundary
 */
export async function reorderProject(
  id: string,
  direction: ReorderDirection
): Promise<void> {
  // Validate direction
  const validatedDirection = reorderDirectionSchema.parse(direction);

  // Get current project (only need id and order)
  const current = await prisma.project.findUnique({
    where: { id },
    select: { id: true, order: true },
  });
  if (!current) {
    throw new Error(`Project not found: ${id}`);
  }

  // Find adjacent project (only need id and order)
  const adjacent = await prisma.project.findFirst({
    where: {
      order: validatedDirection === 'up' ? current.order - 1 : current.order + 1,
    },
    select: { id: true, order: true },
  });

  if (!adjacent) {
    throw new Error(
      `Cannot move ${validatedDirection}: already at ${validatedDirection === 'up' ? 'top' : 'bottom'}`
    );
  }

  // Swap orders (use transaction for atomicity)
  await prisma.$transaction([
    prisma.project.update({
      where: { id: current.id },
      data: { order: adjacent.order },
    }),
    prisma.project.update({
      where: { id: adjacent.id },
      data: { order: current.order },
    }),
  ]);

  // Invalidate landing page cache
  revalidatePath('/');
}
