/**
 * ProjectList Component
 * Maps over projects and renders ProjectCard for each
 *
 * @module components/landing/ProjectList
 * @see PRD Phase 3: Public Landing Page
 */

import type { Project } from '@prisma/client';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  isAuthenticated: boolean;
}

export function ProjectList({ projects, isAuthenticated }: ProjectListProps) {
  if (projects.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-300 mb-6">
        Projects
      </h2>
      <div className="divide-y-0">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </section>
  );
}
