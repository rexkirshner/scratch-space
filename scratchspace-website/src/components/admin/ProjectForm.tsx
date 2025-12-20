/**
 * Project Form Component
 * Handles both creating and editing projects
 *
 * @module components/admin/ProjectForm
 * @see PRD Phase 5: Admin CRUD Operations
 */

'use client';

import { useState } from 'react';
import type { Project } from '@prisma/client';
import { createProjectSchema } from '@/lib/validations/project.schema';
import { z } from 'zod';

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  url: string;
  description: string;
  githubUrl: string;
  visibility: 'PUBLIC' | 'PRIVATE';
};

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;

  const [formData, setFormData] = useState<FormData>({
    name: project?.name || '',
    url: project?.url || '',
    description: project?.description || '',
    githubUrl: project?.githubUrl || '',
    visibility: project?.visibility || 'PRIVATE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Client-side validation
      const validated = createProjectSchema.parse(formData);

      // Submit to API
      const endpoint = isEditing ? `/api/projects/${project.id}` : '/api/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save project');
      }

      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
          placeholder="My Awesome Project"
          disabled={loading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
          Project URL <span className="text-red-400">*</span>
        </label>
        <input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
          placeholder="https://project.scratchspace.dev"
          disabled={loading}
        />
        {errors.url && <p className="mt-1 text-sm text-red-400">{errors.url}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={500}
          rows={4}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors resize-none"
          placeholder="A brief description of what this project does..."
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
      </div>

      {/* GitHub URL */}
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-2">
          GitHub URL <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
          placeholder="https://github.com/username/repo"
          disabled={loading}
        />
        {errors.githubUrl && <p className="mt-1 text-sm text-red-400">{errors.githubUrl}</p>}
      </div>

      {/* Visibility */}
      <div>
        <label htmlFor="visibility" className="block text-sm font-medium text-gray-300 mb-2">
          Visibility <span className="text-red-400">*</span>
        </label>
        <select
          id="visibility"
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
          disabled={loading}
        >
          <option value="PRIVATE">Private (hidden from landing page)</option>
          <option value="PUBLIC">Public (visible on landing page)</option>
        </select>
        {errors.visibility && <p className="mt-1 text-sm text-red-400">{errors.visibility}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
