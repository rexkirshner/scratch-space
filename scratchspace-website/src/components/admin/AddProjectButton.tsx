/**
 * Add Project Button Component
 * Opens modal with project creation form
 *
 * @module components/admin/AddProjectButton
 * @see PRD Phase 5: Admin CRUD Operations
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/shared/Modal';
import { ProjectForm } from './ProjectForm';

export function AddProjectButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
      >
        Add Project
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Project"
      >
        <ProjectForm
          onSuccess={handleSuccess}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
