/**
 * Unit tests for ProjectCard component
 *
 * @see src/components/landing/ProjectCard.tsx
 * @see PRD Phase 3 Checkpoint CP-3.8
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/landing/ProjectCard';
import type { Project } from '@prisma/client';

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: 'test-id-1',
    name: 'Test Project',
    url: 'https://test.scratchspace.dev',
    description: 'A test project for unit testing',
    githubUrl: 'https://github.com/test/repo',
    visibility: 'PUBLIC',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should render project name as link', () => {
    render(<ProjectCard project={mockProject} />);

    const nameLink = screen.getByRole('link', { name: 'Test Project' });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', 'https://test.scratchspace.dev');
    expect(nameLink).toHaveAttribute('target', '_blank');
    expect(nameLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render project description', () => {
    render(<ProjectCard project={mockProject} />);

    const description = screen.getByText('A test project for unit testing');
    expect(description).toBeInTheDocument();
  });

  it('should render "Visit Project" link', () => {
    render(<ProjectCard project={mockProject} />);

    const visitLink = screen.getByRole('link', { name: /Visit Project/ });
    expect(visitLink).toBeInTheDocument();
    expect(visitLink).toHaveAttribute('href', 'https://test.scratchspace.dev');
  });

  it('should render GitHub link when githubUrl is provided', () => {
    render(<ProjectCard project={mockProject} />);

    const githubLink = screen.getByRole('link', { name: /GitHub/ });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/repo');
  });

  it('should not render GitHub link when githubUrl is null', () => {
    const projectWithoutGithub: Project = {
      ...mockProject,
      githubUrl: null,
    };

    render(<ProjectCard project={projectWithoutGithub} />);

    const githubLink = screen.queryByRole('link', { name: /GitHub/ });
    expect(githubLink).not.toBeInTheDocument();
  });

  it('should render all links with target="_blank" and rel="noopener noreferrer"', () => {
    render(<ProjectCard project={mockProject} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should apply correct CSS classes for styling', () => {
    render(<ProjectCard project={mockProject} />);

    const nameLink = screen.getByRole('link', { name: 'Test Project' });
    expect(nameLink).toHaveClass('text-green-400');
    expect(nameLink).toHaveClass('hover:text-green-300');
  });
});
