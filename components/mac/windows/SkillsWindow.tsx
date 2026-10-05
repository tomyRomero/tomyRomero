'use client';
import { useState, useEffect } from 'react';
import { T } from '../tokens';
import { skills, coreStack } from '@/constants';
import { Toolbar, ToolbarButton, TOOLBAR_H, useWidthClass, ChevronLeft, ChevronRight, SearchLine } from '../Native';
import { CATS, CatIcon } from '@/components/SkillIcon';

// Styled after System Settings

const NAMES = Object.keys(skills);

// Opens on a category, as Projects does with requestProjectDetail
let pendingCat: string | null = null;
export function requestSkillCategory(cat: string) {
  pendingCat = cat;
  window.dispatchEvent(new CustomEvent('openSkillCategory', { detail: { cat } }));
}

export default function SkillsWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);
  const [ref, wide] = useWidthClass<HTMLDivElement>([720]);
  const [history, setHistory] = useState<string[]>(() => {
    const c = pendingCat && NAMES.includes(pendingCat) ? pendingCat : NAMES[0];
    pendingCat = null;
    return [c];
  });
  const [at, setAt] = useState(0);
  const [query, setQuery] = useState('');
  const cat = history[at];
  const go = (c: string) => {
    if (c === cat) return;
    setHistory(h => [...h.slice(0, at + 1), c]);
    setAt(a => a + 1);
    setQuery('');
  };

  useEffect(() => {
    const h = (e: Event) => {
      const c = (e as CustomEvent<{ cat: string }>).detail?.cat;
      if (c && NAMES.includes(c)) { pendingCat = null; go(c); }
    };
    window.addEventListener('openSkillCategory', h);
    return () => window.removeEventListener('openSkillCategory', h);
  });

  const q = query.trim().toLowerCase();
  const hits = q ? Object.entries(skills).flatMap(([c, items]) => items.filter(s => s.toLowerCase().includes(q)).map(s => ({ s, c }))) : [];
  const rows = q ? hits : skills[cat].map(s => ({ s, c: cat }));

  const card: React.CSSProperties = {
    borderRadius: 12, background: tk.paneAlt,
    boxShadow: dark ? 'inset 0 0 0 .5px rgba(255,255,255,.06)' : '0 0 0 .5px rgba(0,0,0,.05)',
  };

  return (
    <div ref={ref} style={{ flex: 1, minWidth: 0, display: 'flex', color: tk.label }}>
      <nav aria-label="Skill categories" style={{
        width: wide ? 240 : 196, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: tk.sidebar, borderRight: `1px solid ${tk.sidebarLine}`,
      }}>
        <div data-drag="" style={{ height: TOOLBAR_H, flexShrink: 0 }} />
        <label style={{
          margin: '0 12px 10px', display: 'flex', alignItems: 'center', gap: 6, height: 28, padding: '0 9px',
          borderRadius: 7, background: dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)', color: tk.label2,
        }}>
          <SearchLine />
          <input
            type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search skills" aria-label="Search skills"
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: tk.label }}
          />
        </label>
        <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {NAMES.map(c => {
            const on = !q && c === cat;
            return (
              <button
                key={c}
                onClick={() => go(c)}
                aria-current={on ? 'page' : undefined}
                style={{
                  height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', borderRadius: 7,
                  fontSize: 13.5, fontWeight: on ? 500 : 400, textAlign: 'left',
                  background: on ? tk.select : 'transparent', color: on ? '#fff' : tk.label, transition: 'background .12s',
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}
              >
                <CatIcon cat={c} size={22} />
                <span style={{ flex: 1 }}>{c}</span>
                <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: on ? 'rgba(255,255,255,.85)' : tk.label2 }}>{skills[c].length}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: tk.pane }}>
        <Toolbar style={{ padding: '0 18px', gap: 4 }}>
          <ToolbarButton dark={dark} label="Back" disabled={at === 0} onClick={() => { setAt(a => a - 1); setQuery(''); }}><ChevronLeft /></ToolbarButton>
          <ToolbarButton dark={dark} label="Forward" disabled={at === history.length - 1} onClick={() => { setAt(a => a + 1); setQuery(''); }}><ChevronRight /></ToolbarButton>
          <h2 style={{ marginLeft: 6, fontSize: 15, fontWeight: 600 }}>{q ? 'Search' : cat}</h2>
        </Toolbar>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 26px 26px' }}>
          {/* Fixed width when zoomed */}
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Storage-style overview */}
          <div style={{ ...card, padding: '16px 18px 15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Core stack</span>
              <span style={{ fontSize: 12.5, color: tk.label2 }}>{coreStack.map(c => c.name).join(' · ')}</span>
            </div>
            <div role="img" aria-label={NAMES.map(c => `${c} ${skills[c].length}`).join(', ')} style={{ display: 'flex', gap: 3, height: 14 }}>
              {NAMES.map((c, i) => {
                const on = !q && c === cat;
                return (
                  <button
                    key={c} onClick={() => go(c)} aria-label={c} tabIndex={-1}
                    style={{
                      flexGrow: skills[c].length, flexBasis: 0, padding: 0,
                      borderRadius: i === 0 ? '7px 3px 3px 7px' : i === NAMES.length - 1 ? '3px 7px 7px 3px' : 3,
                      background: CATS[c].color, opacity: on || q ? 1 : .72,
                      boxShadow: on ? `0 0 12px ${CATS[c].color}88` : 'none', transition: 'opacity .2s, box-shadow .2s',
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 12.5, color: tk.label2 }}>
              {NAMES.map(c => {
                const on = !q && c === cat;
                return (
                  <button key={c} onClick={() => go(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: on ? tk.label : tk.label2 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATS[c].color }} />
                    <span style={{ fontWeight: on ? 600 : 400 }}>{c}</span> {skills[c].length}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '2px 2px 0' }}>
            {q ? null : <CatIcon cat={cat} size={46} />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.3px' }}>{q ? `Results for “${query.trim()}”` : cat}</span>
              <span style={{ fontSize: 13, color: tk.label2 }}>{rows.length} skill{rows.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          {rows.length > 0 ? (
            <div key={q || cat} style={{ ...card, display: 'flex', flexDirection: 'column', animation: 'fadeIn .2s ease' }}>
              {rows.map(({ s, c }, i) => (
                <div key={s} style={{
                  minHeight: 46, display: 'flex', alignItems: 'center', gap: 10, margin: '0 18px',
                  borderBottom: i < rows.length - 1 ? `1px solid ${tk.sep}` : 'none',
                }}>
                  {q && <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATS[c].color, flexShrink: 0 }} title={c} />}
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...card, padding: '28px 18px', textAlign: 'center', fontSize: 14, color: tk.label2 }}>No skills match “{query.trim()}”</div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
