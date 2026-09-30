import Image from 'next/image';
import {
  ME, projects, experiences, education, certifications, skills, contactBlurb, profilePhoto, resumeFile,
  totalSkills, yearsExperience,
} from '@/constants';
import { APP_BG, appGlyph } from '@/components/mac/appIcons';
import { GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from '@/components/mac/Icons';
import { CatIcon } from '@/components/SkillIcon';
import { ClassicBar, ClassicFooter, Head, Monogram, Mat } from './parts';
import { THEME, PLATFORM, anchorOf, pageOf } from './shared';
import ClassicScroll from './ClassicScroll';
import ClassicWeather from './ClassicWeather';
import CopyEmail from './CopyEmail';
import { Link } from '@/components/nav';
import s from './classic.module.css';

const SUBJECT = 'Hello from your portfolio';

export default function ClassicPage() {
  const now = experiences[0];
  return (
    <ClassicScroll className={s.page}>
      <script dangerouslySetInnerHTML={{ __html: THEME }} />
      <span id="top" />

      <ClassicBar base="" />

      <div className={s.wrap}>
        <section id="about" aria-label="About" className={s.bento}>
          <div className={`${s.tile} ${s.card} ${s.intro}`}>
            <div className={s.introTop}>
              <span className={s.introPhoto}>
                <Image src={profilePhoto} alt="Picture of Tomy Romero smiling" fill sizes="58px" priority style={{ objectFit: 'cover' }} />
              </span>
              <span className={s.status}><span className={s.dot} aria-hidden="true" />{ME.location} · Open to opportunities</span>
            </div>
            <h1 className={s.name}>{ME.name}</h1>
            <p className={s.title}>{ME.title}</p>
            <p className={s.bio}>{ME.bio}</p>
            <div className={s.introLinks}>
              <a className={s.button} href="#contact"><MailIcon s={15} />Contact</a>
              <a className={s.button} href={ME.github} target="_blank" rel="noopener noreferrer"><GitHubIcon s={15} />GitHub</a>
              <a className={s.button} href={ME.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon s={14} />LinkedIn</a>
            </div>
          </div>

          <div className={`${s.tile} ${s.photoTile}`} aria-hidden="true">
            <figure className={s.polaroid}>
              <span className={s.polaroidImg}>
                <Image src={profilePhoto} alt="" fill sizes="(max-width: 760px) 104px, 150px" priority style={{ objectFit: 'cover' }} />
              </span>
            </figure>
          </div>

          <ClassicWeather />

          <a href="#experience" className={`${s.tile} ${s.card} ${s.role}`}>
            <span className={s.roleTop}>
              <Monogram text={now.logo} t={now.tint} />
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={s.roleName}>{now.title}</span>
                <span className={s.roleMeta}>{now.company} · {now.date}</span>
              </span>
            </span>
            <span className={s.rolePoint}>{now.description[0]}</span>
            <span className={`${s.chips} ${s.roleTech}`}>{now.tech.map(t => <span key={t} className={s.mono}>{t}</span>)}</span>
          </a>

          <a href="#experience" className={`${s.tile} ${s.stat}`} style={{ background: APP_BG.about }}>
            <span className={s.statNum}>{yearsExperience()}</span><span className={s.statLabel}>Years</span>
          </a>
          <a href="#projects" className={`${s.tile} ${s.stat}`} style={{ background: APP_BG.projects }}>
            <span className={s.statNum}>{projects.length}</span><span className={s.statLabel}>Projects</span>
          </a>
          <a href="#skills" className={`${s.tile} ${s.stat}`} style={{ background: APP_BG.skills }}>
            <span className={s.statNum}>{totalSkills}</span><span className={s.statLabel}>Skills</span>
          </a>
          <a href={resumeFile.href} download={resumeFile.filename} className={`${s.tile} ${s.resume}`} style={{ background: APP_BG.resume }}>
            {appGlyph('resume', 'cl', 1.2)}
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={s.resumeName}>Resume</span>
              <span className={s.statLabel}>Download PDF</span>
            </span>
          </a>
        </section>

        <section id="projects" className={`${s.section} ${s.projects}`}>
          <Head app="projects" title="Projects" />
          {projects.map(p => (
            <article key={p.title} id={anchorOf(p.title)} className={s.project}>
              <Mat title={p.title} shot={p.cover} sizes={{ tall: '(max-width: 760px) 100px, 180px', wide: '(max-width: 760px) 80vw, 480px' }} />
              <div className={s.projectBody}>
                <span className={s.label}>{PLATFORM[p.platform]} · {p.year}</span>
                <h3 className={s.projectTitle}>{p.title}</h3>
                <p className={s.tagline}>{p.tagline}</p>
                <p className={s.desc}>{p.description}</p>
                <div className={s.chips}>
                  {p.techStack.split(', ').map(t => <span key={t} className={s.mono}>{t}</span>)}
                </div>
                <div className={s.buttons}>
                  <Link className={`${s.button} ${s.primary}`} href={pageOf(p.title)}>View Project</Link>
                  <a className={s.button} href={p.link} target="_blank" rel="noopener noreferrer"><GitHubIcon s={15} />GitHub</a>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section id="experience" className={s.section}>
          <Head app="experience" title="Experience" />
          <div className={s.timeline}>
            {experiences.map(e => (
              <article key={e.company} className={s.roleRow}>
                <div className={s.when}><strong>{e.date}</strong><span>{e.location}</span></div>
                <div className={s.roleBody}>
                  <div className={s.roleHead}>
                    <Monogram text={e.logo} t={e.tint} />
                    <div>
                      <h3>{e.title}</h3>
                      <div className={s.company}>{e.company}</div>
                    </div>
                  </div>
                  <ul className={s.points}>{e.description.map(x => <li key={x}>{x}</li>)}</ul>
                  <div className={s.chips}>{e.tech.map(t => <span key={t} className={s.mono}>{t}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
          <div className={s.pair}>
            <div className={`${s.card} ${s.pairCard}`}>
              <h3 className={s.label}>Education</h3>
              {education.map(ed => (
                <div key={ed.institution} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className={s.roleHead}>
                    <Monogram text={ed.logo} t={ed.tint} />
                    <div>
                      <strong style={{ fontSize: 16.5 }}>{ed.institution}</strong>
                      <div className={s.company}>{ed.degree}, {ed.field} · {ed.years}</div>
                    </div>
                  </div>
                  <ul className={s.points}>{ed.bullets.map(x => <li key={x}>{x}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className={`${s.card} ${s.pairCard}`}>
              <h3 className={s.label}>Certifications</h3>
              {certifications.map(c => (
                <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className={s.cert}>
                  <strong>{c.name}</strong>
                  <span>{c.issuer} · {c.issued}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className={s.section}>
          <Head app="skills" title="Skills" />
          <div className={s.skills}>
            {Object.entries(skills).map(([cat, items]) => (
              <div key={cat} className={`${s.card} ${s.skillCard}`}>
                <h3><CatIcon cat={cat} size={26} />{cat}</h3>
                <div className={s.chips}>{items.map(x => <span key={x} className={s.chip}>{x}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className={s.contact}>
          <h2 id="contact-title">Contact</h2>
          <p className={s.blurb}>{contactBlurb}</p>
          <div className={s.contactButtons}>
            <a className={s.white} href={`mailto:${ME.email}?subject=${encodeURIComponent(SUBJECT)}`}><MailIcon s={16} />Email Me</a>
            <a className={s.ghost} href={ME.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon s={15} />LinkedIn</a>
            <a className={s.ghost} href={ME.github} target="_blank" rel="noopener noreferrer"><GitHubIcon s={16} />GitHub</a>
          </div>
          <div className={s.contactFacts}>
            <CopyEmail email={ME.email} />
            <span><PinIcon s={15} />{ME.location}</span>
          </div>
        </section>

        <ClassicFooter />
      </div>
    </ClassicScroll>
  );
}
