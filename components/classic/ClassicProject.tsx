import { projects, projectDetails } from '@/constants';
import { GitHubIcon } from '@/components/mac/Icons';
import { ArrowUpRight } from '@/components/mac/Native';
import { ClassicBar, ClassicFooter, Head, Mat } from './parts';
import { THEME, PLATFORM, anchorOf, pageOf } from './shared';
import ClassicShowcase from './ClassicShowcase';
import ClassicScroll from './ClassicScroll';
import { Link } from '@/components/nav';
import s from './classic.module.css';

export default function ClassicProject({ title }: { title: string }) {
  const p = projects.find(x => x.title === title)!;
  const d = projectDetails.find(x => x.title === title)!;
  const others = projects.filter(x => x.title !== title);
  return (
    <ClassicScroll className={s.page}>
      <script dangerouslySetInnerHTML={{ __html: THEME }} />
      <span id="top" />

      <ClassicBar base="/classic" />

      <main className={`${s.wrap} ${s.projectWrap}`}>
        <div className={s.projectTop}>
          <nav aria-label="Breadcrumb" className={s.crumbs}>
            <Link href={`/classic#${anchorOf(title)}`}>Projects</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{title}</span>
          </nav>
          <header className={s.projectHead}>
            <div className={s.projectIntro}>
              <span className={s.label}>{PLATFORM[p.platform]} · {d.year}</span>
              <h1 className={s.projectTitle}>{title}</h1>
              <p className={s.tagline}>{d.type}</p>
            </div>
            <div className={s.buttons}>
              {d.githubrepo && (
                <a className={`${s.button} ${s.primary}`} href={d.githubrepo} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon s={15} />View on GitHub
                </a>
              )}
              {d.isLive && d.livelink && (
                <a className={s.button} href={d.livelink} target="_blank" rel="noopener noreferrer">
                  Live demo <ArrowUpRight s={12} />
                </a>
              )}
            </div>
          </header>
          <ClassicShowcase title={title} />
        </div>

        <section aria-labelledby="more-projects" className={s.section}>
          <Head app="projects" title="More projects" id="more-projects" />
          <div className={s.more}>
            {others.map(o => (
              <Link key={o.title} href={pageOf(o.title)} className={`${s.card} ${s.moreCard}`}>
                <Mat title={o.title} shot={o.cover} sizes={{ tall: '90px', wide: '(max-width: 760px) 80vw, 300px' }} />
                <span className={s.moreBody}>
                  <span className={s.label}>{PLATFORM[o.platform]} · {o.year}</span>
                  <strong>{o.title}</strong>
                  <span>{o.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <ClassicFooter />
      </main>
    </ClassicScroll>
  );
}
