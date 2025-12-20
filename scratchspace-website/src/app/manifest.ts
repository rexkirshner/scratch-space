/**
 * Web App Manifest
 * Provides metadata for PWA installation and mobile home screen
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'scratchspace.dev - Technical Development Studio',
    short_name: 'scratchspace',
    description:
      'Technical development studio building custom web applications and AI solutions for businesses',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
