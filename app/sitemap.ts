import { MetadataRoute } from 'next';
import { projectDetails } from '@/constants';

const BASE = 'https://tomyromero.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = projectDetails.map(p => ({
    url: `${BASE}/project/${encodeURIComponent(p.title)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE}/classic`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...projects,
  ];
}
