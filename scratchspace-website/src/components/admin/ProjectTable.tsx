/**
 * Project Table Component
 * Displays all projects in admin dashboard with CRUD controls
 *
 * @module components/admin/ProjectTable
 * @see PRD Phase 4: Admin Dashboard UI
 */

'use client';

import type { Project } from '@prisma/client';
import { ReorderControls } from './ReorderControls';
import { Modal } from '@/components/shared/Modal';
import { ProjectForm } from './ProjectForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleMoveUp = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/projects/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'up' }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to reorder'}`);
      }
    } catch (_error) {
      alert('Failed to reorder project');
    } finally {
      setLoading(null);
    }
  };

  const handleMoveDown = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/projects/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'down' }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to reorder'}`);
      }
    } catch (_error) {
      alert('Failed to reorder project');
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleEditSuccess = () => {
    setEditingProject(null);
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) {
      return;
    }

    setLoading(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to delete'}`);
      }
    } catch (_error) {
      alert('Failed to delete project');
    } finally {
      setLoading(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No projects yet. Click &quot;Add Project&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              Order
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              URL
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
              Visibility
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.id}
              className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors"
            >
              <td className="py-3 px-4">
                <ReorderControls
                  projectId={project.id}
                  isFirst={index === 0}
                  isLast={index === projects.length - 1}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              </td>
              <td className="py-3 px-4">
                <span className={loading === project.id ? 'opacity-50' : ''}>
                  {project.name}
                </span>
              </td>
              <td className="py-3 px-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 hover:underline text-sm"
                >
                  {project.url}
                </a>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    project.visibility === 'PUBLIC'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {project.visibility}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    disabled={loading === project.id}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    disabled={loading === project.id}
                    className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-900 hover:border-red-800 rounded transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
}
