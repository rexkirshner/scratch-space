/**
 * Admin Dashboard Page
 * Displays all projects with CRUD controls
 *
 * @module app/(authenticated)/admin/page
 * @see PRD Phase 4: Admin Dashboard UI
 */

import { getAllProjects } from '@/lib/services/project.service';
import { ProjectTable } from '@/components/admin/ProjectTable';
import { AddProjectButton } from '@/components/admin/AddProjectButton';

export default async function AdminPage() {
  const projects = await getAllProjects();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Project Management
          </h1>
          <p className="text-gray-400">
            Manage your experimental projects. Changes are reflected immediately
            on the landing page.
          </p>
        </div>

        <AddProjectButton />
      </div>

      {/* Project Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
        <ProjectTable projects={projects} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {projects.length}
          </div>
          <div className="text-sm text-gray-500">Total Projects</div>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {projects.filter((p) => p.visibility === 'PUBLIC').length}
          </div>
          <div className="text-sm text-gray-500">Public</div>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-500">
            {projects.filter((p) => p.visibility === 'PRIVATE').length}
          </div>
          <div className="text-sm text-gray-500">Private</div>
        </div>
      </div>
    </div>
  );
}
