/**
 * Landing Page Loading State
 * Shown while fetching public projects
 *
 * @module app/loading
 * @see Code Review: Add loading states recommendation
 */

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Skeleton */}
        <header className="mb-12">
          <div className="h-10 w-64 bg-gray-800 rounded animate-pulse mb-4" />
          <div className="h-6 w-full max-w-2xl bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-6 w-3/4 max-w-xl bg-gray-800 rounded animate-pulse" />
        </header>

        {/* Projects Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-800 pb-6"
            >
              <div className="h-7 w-48 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-5 w-full bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-5 w-3/4 bg-gray-800 rounded animate-pulse mb-3" />
              <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
