'use client';
import { useSyncExternalStore } from 'react';
import Showcase from '@/components/ProjectShowcase';
import s from './classic.module.css';

// The server renders light, so hide it on dark pages until the client re-renders
const watch = (fn: () => void) => {
  const o = new MutationObserver(fn);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => o.disconnect();
};
const isDark = () => document.documentElement.dataset.theme === 'dark';

export default function ClassicShowcase({ title }: { title: string }) {
  const dark = useSyncExternalStore<boolean | null>(watch, isDark, () => null);
  return (
    <div className={`${s.card} ${s.showcase} ${dark === null ? s.pending : ''}`}>
      <Showcase title={title} dark={!!dark} level={2} animate={false} />
    </div>
  );
}
