/**
 * Landing Page
 * Displays public projects (or all projects if authenticated)
 * with site description and RBK attribution
 *
 * @module app/page
 * @see PRD Phase 3: Public Landing Page
 */

import { getPublicProjects, getAllProjects } from '@/lib/services/project.service';
import { ProjectList } from '@/components/landing/ProjectList';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth.config';
import type { Metadata } from 'next';

// ISR: Cache page for 60 seconds, revalidate on project mutations
// See: docs/audits/PRISMA_EFFICIENCY_AUDIT_01.md
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scratchspace.dev';

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function Home() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  // If authenticated, show all projects; otherwise show only public
  const projects = isAuthenticated
    ? await getAllProjects()
    : await getPublicProjects();

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'scratchspace.dev',
        description:
          'A curated collection of experimental open-source projects and prototypes',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Rex Kirshner',
        url: SITE_URL,
        jobTitle: 'Software Engineer & Founder',
        worksFor: {
          '@id': `${SITE_URL}/#organization`,
        },
        sameAs: [
          'https://rexkirshner.com',
          'https://linkedin.com/in/rexkirshner',
          'https://github.com/rexkirshner',
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'RBK Strategies',
        url: 'https://rbkstrategies.com',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
        },
        founder: {
          '@id': `${SITE_URL}/#person`,
        },
        sameAs: [
          'https://linkedin.com/company/rbkstrategies',
          'https://github.com/rbkstrategies',
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: 'scratchspace.dev - Experimental Open-Source Projects by Rex Kirshner',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#organization`,
        },
        author: {
          '@id': `${SITE_URL}/#person`,
        },
        description:
          'A collection of experimental open-source projects and prototypes by Rex Kirshner. Explore innovative web technologies, developer tools, and educational platforms.',
        inLanguage: 'en-US',
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <ProjectList projects={projects} isAuthenticated={isAuthenticated} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {isAuthenticated ? '' : 'public '}projects yet. Check back soon!
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
              <span className="mx-2" aria-hidden="true">|</span>
              <a
                href="https://rexkirshner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 hover:underline transition-colors"
              >
                Rex Kirshner
              </a>
              , Founder
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
