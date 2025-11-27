/**
 * Global Error Boundary
 * Catches unhandled errors in the application
 *
 * @module app/error
 * @see Code Review: Missing error boundaries recommendation
 */

'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-950 border border-red-900/30 rounded-lg p-8">
          {/* Error Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-400 text-center mb-6">
            An unexpected error occurred. We apologize for the inconvenience.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-800">
              <p className="text-sm font-mono text-red-400 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded transition-colors font-medium"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors font-medium text-center"
            >
              Go to homepage
            </a>
          </div>
        </div>

        {/* Additional Help */}
        <p className="text-center text-sm text-gray-500 mt-6">
          If this problem persists, please{' '}
          <a
            href="https://rbkstrategies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
