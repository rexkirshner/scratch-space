/**
 * Custom 404 Page
 * Displayed when a route is not found
 *
 * @module app/not-found
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page not found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded transition-colors"
          >
            Back to home
          </Link>
          <a
            href="mailto:inquiries@scratchspace.dev"
            className="inline-block px-6 py-3 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium rounded transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </main>
  );
}
