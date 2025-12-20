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
          'Technical development studio building custom web applications, AI solutions, and digital platforms',
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
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Los Angeles',
          addressRegion: 'CA',
          addressCountry: 'US',
        },
        sameAs: [
          'https://www.linkedin.com/company/scratchspace/',
          'https://linkedin.com/company/rbkstrategies',
          'https://github.com/rbkstrategies',
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: 'scratchspace.dev - Technical Development Studio',
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
          'Custom software development and technical solutions by Rex Kirshner. We build web applications, AI integrations, and scalable digital platforms for businesses.',
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
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mb-6">
              Technical development studio building custom web applications,
              AI-powered solutions, and scalable digital platforms for businesses.
            </p>
            <a
              href="mailto:inquiries@scratchspace.dev"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded transition-colors"
            >
              Get in touch
            </a>
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
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-500">
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
              <div className="flex items-center gap-4 text-gray-600">
                <span>Los Angeles, CA</span>
                <a
                  href="https://www.linkedin.com/company/scratchspace/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-400 transition-colors"
                  aria-label="scratchspace on LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
