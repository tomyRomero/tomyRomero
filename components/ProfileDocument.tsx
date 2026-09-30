import {
  ME, experiences, projects, projectDetails, skills, education, certifications, resumeFile,
} from '@/constants';

// Visually hidden, server-rendered summary for screen readers and crawlers
export default function ProfileDocument() {
  return (
    <article className="profile-doc" aria-label="Portfolio summary">
      <header>
        <h1>{`${ME.name}, ${ME.title}`}</h1>
        <p>{`${ME.location}. Open to opportunities.`}</p>
        <p>{ME.bio}</p>
        <ul>
          <li><a href={resumeFile.href}>Resume (PDF)</a></li>
          <li><a href={`mailto:${ME.email}`}>{`Email ${ME.email}`}</a></li>
          <li><a href={ME.github}>GitHub</a></li>
          <li><a href={ME.linkedin}>LinkedIn</a></li>
        </ul>
      </header>

      <section>
        <h2>Experience</h2>
        {experiences.map(e => (
          <section key={e.company}>
            <h3>{`${e.title}, ${e.company}`}</h3>
            <p>{`${e.date}, ${e.location}`}</p>
            <ul>{e.description.map(d => <li key={d}>{d}</li>)}</ul>
            <p>{`Tech: ${e.tech.join(', ')}`}</p>
          </section>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.map(p => {
          const d = projectDetails.find(x => x.title === p.title);
          return (
            <section key={p.title}>
              <h3><a href={`/project/${encodeURIComponent(p.title)}`}>{p.title}</a>{` (${p.year})`}</h3>
              <p>{`${p.tagline}. ${d?.description ?? p.description}`}</p>
              <p>{`Tech: ${p.techStack}`}</p>
              {d?.githubrepo && <p><a href={d.githubrepo}>Source on GitHub</a></p>}
            </section>
          );
        })}
      </section>

      <section>
        <h2>Skills</h2>
        <dl>
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Education</h2>
        {education.map(e => (
          <p key={e.institution}>{`${e.degree} in ${e.field}, ${e.institution} (${e.period})`}</p>
        ))}
        <h2>Certifications</h2>
        <ul>
          {certifications.map(c => (
            <li key={c.name}><a href={c.url}>{c.name}</a>{`, ${c.issuer}, ${c.issued}`}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
