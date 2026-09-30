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

  // Unknown project: keep it out of search
  if (!detail && !proj) return { title: 'Project not found', robots: { index: false, follow: true } };

  const description = (detail?.description || proj?.description || '').slice(0, 155);
  const cover       = proj?.cover;
  const heroImg     = cover ? `${BASE}${cover.src}` : undefined;
  const pageUrl     = `${BASE}/project/${encodeURIComponent(name)}`;

  return {
    // The layout's title template adds the site name
    title: name,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title:       `${name} · Tomy F. Romero`,
      description,
      type:        'article',
      url:         pageUrl,
      siteName:    'Tomy F. Romero · Portfolio',
      locale:      'en_US',
      ...(heroImg ? {
        images: [{ url: heroImg, width: cover!.w, height: cover!.h, alt: `${name} screenshot` }],
      } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${name} · Tomy F. Romero`,
      description,
      ...(heroImg ? { images: [heroImg] } : {}),
    },
  };
}

function projectJsonLd(name: string) {
  const detail = projectDetails.find(p => p.title === name);
  const proj   = projects.find(p => p.title === name);
  if (!detail || !proj) return null;
  const url = `${BASE}/project/${encodeURIComponent(name)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':          'SoftwareSourceCode',
        name,
        description:      detail.description,
        url,
        codeRepository:   detail.githubrepo,
        dateCreated:      detail.year,
        keywords:         proj.techStack,
        ...(proj.cover ? { image: `${BASE}${proj.cover.src}` } : {}),
        author:           { '@id': `${BASE}/#person` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Portfolio', item: BASE },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  };
}

export default function ProjectLayout(
  { children, params }: { children: React.ReactNode; params: { title: string } },
) {
  const ld = projectJsonLd(decodeURIComponent(params.title));
  return (
    <>
      {ld && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
      {children}
    </>
  );
}
