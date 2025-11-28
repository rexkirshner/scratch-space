/**
 * ProjectCard Component
 * Displays a single project with name, description, and links
 *
 * @module components/landing/ProjectCard
 * @see PRD Phase 3: Public Landing Page
 */

import type { Project } from '@prisma/client';

interface ProjectCardProps {
  project: Project;
  isAuthenticated: boolean;
}

export function ProjectCard({ project, isAuthenticated }: ProjectCardProps) {
  const isPrivate = project.visibility === 'PRIVATE';

  return (
    <article
      className="mb-6 last:mb-0"
      itemScope
      itemType="https://schema.org/SoftwareSourceCode"
    >
      {/* Project Name with Private Badge */}
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-semibold">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 hover:underline transition-colors"
            itemProp="url"
          >
            <span itemProp="name">{project.name}</span>
          </a>
        </h3>
        {isAuthenticated && isPrivate && (
          <span
            className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded border border-gray-700"
            title="This project is only visible to you (logged in)"
          >
            Private
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-3 leading-relaxed" itemProp="description">
        {project.description}
      </p>

      {/* Links */}
      <div className="flex items-center gap-4 text-sm">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:text-green-400 hover:underline transition-colors"
          aria-label={`Visit ${project.name} project website`}
        >
          Visit {project.name} →
        </a>

        {project.githubUrl && (
          <>
            <span className="text-gray-700" aria-hidden="true">
              |
            </span>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 hover:underline transition-colors flex items-center gap-1"
              aria-label={`View ${project.name} source code on GitHub`}
              itemProp="codeRepository"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="img"
              >
                <title>GitHub</title>
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>View on GitHub</span>
            </a>
          </>
        )}
      </div>
    </article>
  );
}
