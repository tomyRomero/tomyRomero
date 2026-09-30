'use client';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@/components/mac/Icons';
import s from './classic.module.css';

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark'); }, []);
  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try { localStorage.setItem('dark', String(next)); } catch {}
  };
  return (
    <button className={s.round} onClick={flip} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {dark ? <SunIcon s={16} /> : <MoonIcon s={16} />}
    </button>
  );
}
