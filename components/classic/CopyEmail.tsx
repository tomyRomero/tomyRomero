'use client';
import { useRef, useState } from 'react';
import { MailIcon } from '@/components/mac/Icons';
import { CheckIcon, CopyIcon } from '@/components/mac/Native';
import s from './classic.module.css';

// Falls back to selecting the text where the clipboard API is unavailable (http)
export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  const text = useRef<HTMLSpanElement>(null);
  const select = () => {
    const r = document.createRange();
    r.selectNodeContents(text.current!);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  };
  const copy = () => {
    if (!navigator.clipboard) { select(); return; }
    navigator.clipboard.writeText(email).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    }, select);
  };
  return (
    <button type="button" className={s.copy} onClick={copy} aria-label={done ? 'Email address copied' : `Copy ${email}`}>
      <MailIcon s={15} /><span ref={text}>{email}</span>
      <span className={s.copyMark} aria-hidden="true">{done ? <CheckIcon s={13} /> : <CopyIcon s={13} />}</span>
    </button>
  );
}
