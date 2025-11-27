/**
 * Zod validation schemas for Project model
 * Enforces data constraints for CRUD operations
 *
 * @module lib/validations/project.schema
 * @see PRD Phase 2: Data Access Layer
 * @see PRD Data Models: Project constraints
 */

import { z } from 'zod';

/**
 * URL validation regex
 * Must start with http:// or https://
 */
const urlRegex = /^https?:\/\/.+/;

/**
 * Schema for creating a new project
 * All fields required except githubUrl
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  url: z
    .string()
    .regex(urlRegex, 'URL must start with http:// or https://')
    .max(500, 'URL must be 500 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  githubUrl: z
    .string()
    .regex(urlRegex, 'GitHub URL must start with http:// or https://')
    .max(500, 'GitHub URL must be 500 characters or less')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
});

/**
 * Schema for updating an existing project
 * All fields optional (partial update)
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  url: z
    .string()
    .regex(urlRegex, 'URL must start with http:// or https://')
    .max(500, 'URL must be 500 characters or less')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  githubUrl: z
    .string()
    .regex(urlRegex, 'GitHub URL must start with http:// or https://')
    .max(500, 'GitHub URL must be 500 characters or less')
    .nullable()
    .optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
});

/**
 * Schema for reorder direction
 */
export const reorderDirectionSchema = z.enum(['up', 'down']);

// TypeScript types inferred from schemas
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ReorderDirection = z.infer<typeof reorderDirectionSchema>;
