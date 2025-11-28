/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml for search engines
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';
import { getPublicProjects } from '@/lib/services/project.service';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scratchspace.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all public projects for dynamic URLs
  const projects = await getPublicProjects();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Dynamic project pages (external links, but we list them for reference)
  // Note: External project URLs are not included in sitemap as they're not part of our domain
  // Only listing pages that exist on scratchspace.dev

  return staticPages;
}
