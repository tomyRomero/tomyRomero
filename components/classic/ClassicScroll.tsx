'use client';
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { isTraversal } from '@/components/nav';
import { KEEP_SCROLL, SCROLL_KEY } from './shared';

// The page scrolls inside this element rather than the window, so neither the
// browser nor Next restores it on Back. Positions are kept per path.
const saved = (): Record<string, number> => {
  try { return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}'); } catch { return {}; }
};

const never = () => () => {};

export default function ClassicScroll({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // True only while hydrating a full page load
  const hydrating = useRef(useSyncExternalStore(never, () => false, () => true)).current;

  useLayoutEffect(() => {
    const el = ref.current!;
    const path = location.pathname;
    // A full load was already handled by KEEP_SCROLL
    if (!hydrating) {
      const y = saved()[path];
      if (isTraversal() && y != null) el.scrollTo({ top: y, behavior: 'instant' });
      else if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
    }
    const save = () => {
      try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ ...saved(), [path]: el.scrollTop })); } catch {}
    };
    addEventListener('pagehide', save);
    return () => { save(); removeEventListener('pagehide', save); };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
      <script dangerouslySetInnerHTML={{ __html: KEEP_SCROLL }} />
    </div>
  );
}
