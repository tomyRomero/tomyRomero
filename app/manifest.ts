import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tomy Romero Seas · Software Engineer',
    short_name: 'Tomy Romero',
    description: 'Full-stack software engineer portfolio: ASP.NET Core, React, SQL Server.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0c11',
    theme_color: '#0A84FF',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
