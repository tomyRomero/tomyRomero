import type { Metadata } from 'next';
import ClassicPage from '@/components/classic/ClassicPage';

const BASE = 'https://tomyromero.vercel.app';

export const metadata: Metadata = {
  title: 'Classic View',
  alternates: { canonical: `${BASE}/classic` },
};

export default function Classic() {
  return <ClassicPage />;
}
