'use client';
import { T } from '../tokens';
import { Chip, WinTitle, Bullet } from '../Atoms';
import { experiences, education, certifications } from '@/constants';

export default function ExperienceWindow({ dark }: { dark: boolean }) {
  const tk = T(dark);

  return (
    <div style={{ padding: '22px 24px', color: tk.text }}>
      <WinTitle dark={dark}>Work <em style={{ color: tk.accent, fontStyle: 'italic' }}>History</em></WinTitle>

      {experiences.map((exp, i) => (
        <div key={exp.company} style={{ position: 'relative', paddingLeft: 24, marginBottom: 28 }}>
          {/* Timeline dot */}
          <div style={{
            position: 'absolute', left: 0, top: 5, width: 10, height: 10, borderRadius: '50%',
            background: i === 0 ? tk.accent : tk.pillBorder,
            border: `2px solid ${i === 0 ? 'rgba(212,148,58,.3)' : tk.divider}`,
          }} />
          {/* Timeline line */}
          {i < experiences.length - 1 && (
            <div style={{
              position: 'absolute', left: 4, top: 20, width: 2,
              height: 'calc(100% - 4px)', background: tk.divider, borderRadius: 1,
            }} />
          )}

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 20 }}>{exp.logo}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: tk.text }}>{exp.company}</div>
                <div style={{ fontSize: 13, color: tk.accent, marginTop: 1 }}>{exp.title}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono), monospace', color: tk.textMuted }}>{exp.date}</div>
              <div style={{ fontSize: 11, color: tk.textMuted, marginTop: 2 }}>{exp.location}</div>
            </div>
          </div>

          {/* Bullets */}
          <div style={{
            background: tk.cardBg, border: `1px solid ${tk.cardBorder}`,
            borderRadius: 10, padding: '12px 14px', marginBottom: 10,
          }}>
            {exp.description.map((b, j) => <Bullet key={j} dark={dark}>{b}</Bullet>)}
          </div>

          {/* Tech chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {exp.tech.map(t => <Chip key={t} dark={dark}>{t}</Chip>)}
          </div>
        </div>
      ))}

      {/* Education */}
      <div style={{ borderTop: `1px solid ${tk.divider}`, paddingTop: 20, marginTop: 4 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: tk.textMuted,
          textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: 14,
          fontFamily: 'var(--font-mono), monospace',
        }}>
          Education
        </div>
        {education.map(edu => (
          <div
            key={edu.institution}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 16px', background: tk.cardBg,
              border: `1px solid ${tk.cardBorder}`, borderRadius: 12,
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>{edu.logo}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: tk.text }}>{edu.institution}</div>
              <div style={{ fontSize: 13, color: tk.accent, marginTop: 2 }}>
                {edu.degree} — {edu.field}
              </div>
              <div style={{ fontSize: 12, color: tk.textMuted, marginTop: 2 }}>
                {edu.period} · {edu.location} · GPA {edu.gpa}
              </div>
              <div style={{ marginTop: 8 }}>
                {edu.bullets.map((b, i) => <Bullet key={i} dark={dark}>{b}</Bullet>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Certifications */}
      <div style={{ borderTop: `1px solid ${tk.divider}`, paddingTop: 20, marginTop: 20 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: tk.textMuted,
          textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: 14,
          fontFamily: 'var(--font-mono), monospace',
        }}>
          Certifications
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {certifications.map(cert => (
            <div
              key={cert.name}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', background: tk.cardBg,
                border: `1px solid ${tk.cardBorder}`, borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{cert.logo}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: tk.text }}>{cert.name}</div>
                <div style={{ fontSize: 12, color: tk.accent, marginTop: 2 }}>{cert.issuer}</div>
                <div style={{ fontSize: 11.5, color: tk.textMuted, marginTop: 2 }}>
                  Issued {cert.issued}
                  {cert.credentialId && (
                    <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono), monospace' }}>
                      · ID {cert.credentialId}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flexShrink: 0, padding: '5px 12px', borderRadius: 8, fontSize: 11.5,
                  fontFamily: 'var(--font-mono), monospace',
                  background: tk.accentBg, border: `1px solid ${tk.accentBorder}`,
                  color: tk.accent, textDecoration: 'none', fontWeight: 500,
                  transition: 'opacity .15s', whiteSpace: 'nowrap' as const,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.70')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                View ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
