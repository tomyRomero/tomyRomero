import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, projectDetails } from '@/constants';
import ClassicProject from '@/components/classic/ClassicProject';

const BASE = 'https://tomyromero.vercel.app';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(p => ({ title: encodeURIComponent(p.title) }));
}

const find = (param: string) => {
  const name = decodeURIComponent(param);
  return projects.some(p => p.title === name) && projectDetails.some(p => p.title === name) ? name : null;
};

export function generateMetadata({ params }: { params: { title: string } }): Metadata {
  const name = find(params.title);
  if (!name) return {};
  return {
    title: name,
    description: projectDetails.find(p => p.title === name)!.description.slice(0, 155),
    alternates: { canonical: `${BASE}/project/${encodeURIComponent(name)}` },
  };
}

export default function ClassicProjectPage({ params }: { params: { title: string } }) {
  const name = find(params.title);
  if (!name) notFound();
  return <ClassicProject title={name} />;
}
