/**
 * Admin Dashboard Loading State
 * Shown while fetching projects
 *
 * @module app/(authenticated)/admin/loading
 * @see Code Review: Add loading states recommendation
 */

export default function AdminLoading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-9 w-64 bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="p-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 mb-4 pb-3 border-b border-gray-800">
            <div className="h-4 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 bg-gray-800 rounded animate-pulse" />
          </div>

          {/* Table Rows */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 mb-4 pb-4 border-b border-gray-900 last:border-b-0"
            >
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-950 border border-gray-800 rounded-lg p-4"
          >
            <div className="h-8 w-16 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
