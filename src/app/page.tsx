/**
 * Landing Page
 * Displays public projects with site description and RBK attribution
 *
 * @module app/page
 * @see PRD Phase 3: Public Landing Page
 */

import { getPublicProjects } from '@/lib/services/project.service';
import { ProjectList } from '@/components/landing/ProjectList';

export default async function Home() {
  const projects = await getPublicProjects();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            scratchspace.dev
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
            A collection of experimental open-source projects and prototypes.
            This is where new ideas are tested, features are explored, and
            innovative solutions take their first steps.
          </p>
        </header>

        {/* Projects Section */}
        {projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No public projects yet. Check back soon!
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            A property of{' '}
            <a
              href="https://rbkstrategies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 hover:underline transition-colors"
            >
              RBK Strategies
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
