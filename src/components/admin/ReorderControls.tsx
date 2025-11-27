/**
 * Reorder Controls Component
 * Up/Down arrow buttons for manual project ordering
 *
 * @module components/admin/ReorderControls
 * @see PRD Phase 4: Admin Dashboard UI
 * @see PRD Flow 6: Admin Reorders Projects
 */

'use client';

interface ReorderControlsProps {
  projectId: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (id: string) => Promise<void>;
  onMoveDown: (id: string) => Promise<void>;
}

export function ReorderControls({
  projectId,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: ReorderControlsProps) {
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => onMoveUp(projectId)}
        disabled={isFirst}
        className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Move up"
        title="Move up"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
      <button
        onClick={() => onMoveDown(projectId)}
        disabled={isLast}
        className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Move down"
        title="Move down"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
