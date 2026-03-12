import { Metadata } from 'next';
import { projectDetails, projects } from '@/constants';

const BASE = 'https://tomyromero.vercel.app';

export async function generateStaticParams() {
  return projectDetails.map(p => ({ title: encodeURIComponent(p.title) }));
}

export async function generateMetadata(
  { params }: { params: { title: string } },
): Promise<Metadata> {
  const name   = decodeURIComponent(params.title);
  const detail = projectDetails.find(p => p.title === name);
  const proj   = projects.find(p => p.title === name);

  if (!detail && !proj) return { title: 'Project — Tomy Romero Seas' };

  const description = (detail?.description || proj?.description || '').slice(0, 155);
  const heroImg     = proj?.image ? `${BASE}${proj.image}` : undefined;
  const pageUrl     = `${BASE}/project/${encodeURIComponent(name)}`;

  return {
    title: `${name} — Tomy Romero Seas`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title:       `${name} — Tomy Romero Seas`,
      description,
      type:        'article',
      url:         pageUrl,
      siteName:    'Tomy Romero Seas — Portfolio',
      locale:      'en_US',
      ...(heroImg ? {
        images: [{ url: heroImg, width: 1280, height: 800, alt: `${name} screenshot` }],
      } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${name} — Tomy Romero Seas`,
      description,
      ...(heroImg ? { images: [heroImg] } : {}),
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
