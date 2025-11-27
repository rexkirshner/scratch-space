/**
 * Unit tests for ProjectService
 *
 * @see src/lib/services/project.service.ts
 * @see PRD Phase 2 Checkpoints CP-2.1 through CP-2.8
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import {
  getPublicProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProject,
} from '@/lib/services/project.service';

// Helper to clean up database between tests
async function cleanupProjects() {
  await prisma.project.deleteMany();
}

describe('ProjectService', () => {
  beforeEach(async () => {
    await cleanupProjects();
  });

  afterEach(async () => {
    await cleanupProjects();
  });

  describe('getPublicProjects', () => {
    it('should return only PUBLIC projects', async () => {
      // Create mix of public and private projects
      await prisma.project.createMany({
        data: [
          {
            name: 'Public Project',
            url: 'https://public.test',
            description: 'A public project',
            visibility: 'PUBLIC',
            order: 0,
          },
          {
            name: 'Private Project',
            url: 'https://private.test',
            description: 'A private project',
            visibility: 'PRIVATE',
            order: 1,
          },
        ],
      });

      const projects = await getPublicProjects();

      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe('Public Project');
      expect(projects[0].visibility).toBe('PUBLIC');
    });

    it('should return projects ordered by order ASC', async () => {
      await prisma.project.createMany({
        data: [
          {
            name: 'Third',
            url: 'https://third.test',
            description: 'Third',
            visibility: 'PUBLIC',
            order: 2,
          },
          {
            name: 'First',
            url: 'https://first.test',
            description: 'First',
            visibility: 'PUBLIC',
            order: 0,
          },
          {
            name: 'Second',
            url: 'https://second.test',
            description: 'Second',
            visibility: 'PUBLIC',
            order: 1,
          },
        ],
      });

      const projects = await getPublicProjects();

      expect(projects[0].name).toBe('First');
      expect(projects[1].name).toBe('Second');
      expect(projects[2].name).toBe('Third');
    });

    it('should return empty array when no public projects exist', async () => {
      await prisma.project.create({
        data: {
          name: 'Private Only',
          url: 'https://private.test',
          description: 'Private project',
          visibility: 'PRIVATE',
          order: 0,
        },
      });

      const projects = await getPublicProjects();

      expect(projects).toHaveLength(0);
    });
  });

  describe('getAllProjects', () => {
    it('should return PUBLIC and PRIVATE projects', async () => {
      await prisma.project.createMany({
        data: [
          {
            name: 'Public',
            url: 'https://public.test',
            description: 'Public',
            visibility: 'PUBLIC',
            order: 0,
          },
          {
            name: 'Private',
            url: 'https://private.test',
            description: 'Private',
            visibility: 'PRIVATE',
            order: 1,
          },
        ],
      });

      const projects = await getAllProjects();

      expect(projects).toHaveLength(2);
    });
  });

  describe('createProject', () => {
    it('should create project with valid data', async () => {
      const data = {
        name: 'Test Project',
        url: 'https://test.scratchspace.dev',
        description: 'A test project',
        githubUrl: 'https://github.com/test/repo',
        visibility: 'PUBLIC' as const,
      };

      const project = await createProject(data);

      expect(project.name).toBe(data.name);
      expect(project.url).toBe(data.url);
      expect(project.description).toBe(data.description);
      expect(project.githubUrl).toBe(data.githubUrl);
      expect(project.visibility).toBe(data.visibility);
      expect(project.order).toBe(0);
    });

    it('should assign incremental order numbers', async () => {
      const project1 = await createProject({
        name: 'First',
        url: 'https://first.test',
        description: 'First project',
        visibility: 'PUBLIC',
      });

      const project2 = await createProject({
        name: 'Second',
        url: 'https://second.test',
        description: 'Second project',
        visibility: 'PUBLIC',
      });

      expect(project1.order).toBe(0);
      expect(project2.order).toBe(1);
    });

    it('should reject invalid URL format', async () => {
      const data = {
        name: 'Test',
        url: 'not-a-valid-url',
        description: 'Test',
        visibility: 'PUBLIC' as const,
      };

      await expect(createProject(data)).rejects.toThrow();
    });

    it('should reject name longer than 100 chars', async () => {
      const data = {
        name: 'a'.repeat(101),
        url: 'https://test.test',
        description: 'Test',
        visibility: 'PUBLIC' as const,
      };

      await expect(createProject(data)).rejects.toThrow();
    });

    it('should handle optional githubUrl', async () => {
      const project = await createProject({
        name: 'Test',
        url: 'https://test.test',
        description: 'Test',
        visibility: 'PRIVATE',
      });

      expect(project.githubUrl).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should update existing project', async () => {
      const project = await prisma.project.create({
        data: {
          name: 'Original',
          url: 'https://original.test',
          description: 'Original description',
          visibility: 'PRIVATE',
          order: 0,
        },
      });

      const updated = await updateProject(project.id, {
        name: 'Updated',
        description: 'Updated description',
      });

      expect(updated.name).toBe('Updated');
      expect(updated.description).toBe('Updated description');
      expect(updated.url).toBe('https://original.test'); // Unchanged
    });

    it('should throw error if project not found', async () => {
      await expect(
        updateProject('non-existent-id', { name: 'Test' })
      ).rejects.toThrow('Project not found');
    });
  });

  describe('deleteProject', () => {
    it('should delete existing project', async () => {
      const project = await prisma.project.create({
        data: {
          name: 'To Delete',
          url: 'https://delete.test',
          description: 'Will be deleted',
          visibility: 'PRIVATE',
          order: 0,
        },
      });

      await deleteProject(project.id);

      const found = await prisma.project.findUnique({
        where: { id: project.id },
      });
      expect(found).toBeNull();
    });

    it('should throw error if project not found', async () => {
      await expect(deleteProject('non-existent-id')).rejects.toThrow(
        'Project not found'
      );
    });
  });

  describe('reorderProject', () => {
    it('should swap order when moving up', async () => {
      const project1 = await prisma.project.create({
        data: {
          name: 'First',
          url: 'https://first.test',
          description: 'First',
          order: 0,
        },
      });

      const project2 = await prisma.project.create({
        data: {
          name: 'Second',
          url: 'https://second.test',
          description: 'Second',
          order: 1,
        },
      });

      await reorderProject(project2.id, 'up');

      const updated1 = await prisma.project.findUnique({
        where: { id: project1.id },
      });
      const updated2 = await prisma.project.findUnique({
        where: { id: project2.id },
      });

      expect(updated1?.order).toBe(1);
      expect(updated2?.order).toBe(0);
    });

    it('should swap order when moving down', async () => {
      const project1 = await prisma.project.create({
        data: {
          name: 'First',
          url: 'https://first.test',
          description: 'First',
          order: 0,
        },
      });

      const project2 = await prisma.project.create({
        data: {
          name: 'Second',
          url: 'https://second.test',
          description: 'Second',
          order: 1,
        },
      });

      await reorderProject(project1.id, 'down');

      const updated1 = await prisma.project.findUnique({
        where: { id: project1.id },
      });
      const updated2 = await prisma.project.findUnique({
        where: { id: project2.id },
      });

      expect(updated1?.order).toBe(1);
      expect(updated2?.order).toBe(0);
    });

    it('should throw error when moving up at top', async () => {
      const project = await prisma.project.create({
        data: {
          name: 'First',
          url: 'https://first.test',
          description: 'First',
          order: 0,
        },
      });

      await expect(reorderProject(project.id, 'up')).rejects.toThrow(
        'Cannot move up'
      );
    });

    it('should throw error when moving down at bottom', async () => {
      const project = await prisma.project.create({
        data: {
          name: 'Only',
          url: 'https://only.test',
          description: 'Only',
          order: 0,
        },
      });

      await expect(reorderProject(project.id, 'down')).rejects.toThrow(
        'Cannot move down'
      );
    });
  });
});
