/**
 * Add Project Button Component
 * Client component for Add Project button (placeholder until Phase 5 complete)
 *
 * @module components/admin/AddProjectButton
 * @see PRD Phase 5: Admin CRUD Operations
 */

'use client';

export function AddProjectButton() {
  const handleClick = () => {
    alert('Add Project form - Coming in Phase 5');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
    >
      Add Project
    </button>
  );
}
