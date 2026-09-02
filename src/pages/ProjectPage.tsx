import { Link } from '@/app/Link'
import { Nav } from '@/components/Nav'
import { nextProject, projectPath, type Project, type ProjectSection } from '@/content/projects'
import { siteContent } from '@/content/site'

import styles from './ProjectPage.module.css'

function SectionBlock({ section }: { section: ProjectSection }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      <div className={styles.sectionBody}>
        {section.highlight ? <p className={styles.highlight}>{section.highlight}</p> : null}
        {section.content?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.steps ? (
          <ol className={styles.steps}>
            {section.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        {section.items ? (
          <ul className={styles.items}>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

export function ProjectPage({ project }: { project: Project }) {
  const upcoming = nextProject(project.slug)
  const meta = [project.type, project.year].filter(Boolean).join(' · ')

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <Link className={styles.back} href="/#projects">
          <span aria-hidden="true">←</span> Projects
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.meta}>{meta}</p>
          {project.tags?.length ? <p className={styles.tags}>{project.tags.join(' · ')}</p> : null}
        </header>

        {project.overview ? <p className={styles.overview}>{project.overview}</p> : null}

        {project.role ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About the project</h2>
            <div className={styles.sectionBody}>
              <p>{project.role}</p>
            </div>
          </section>
        ) : null}

        {project.contribution?.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My contribution</h2>
            <div className={styles.sectionBody}>
              <ul className={styles.contribution}>
                {project.contribution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {project.sections?.map((section) => (
          <SectionBlock key={section.title} section={section} />
        ))}

        {project.media?.length ? (
          <div className={styles.media}>
            {project.media.map((item) => (
              <figure key={item.src} className={styles.figure}>
                {item.kind === 'video' ? (
                  <video src={item.src} controls playsInline preload="metadata" />
                ) : (
                  <img src={item.src} alt={item.alt} loading="lazy" />
                )}
                {item.caption ? <figcaption>{item.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}

        {project.externalLinks?.length ? (
          <ul className={styles.externalLinks}>
            {project.externalLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer noopener">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {upcoming ? (
          <Link className={styles.next} href={projectPath(upcoming.slug)}>
            <span className={styles.nextLabel}>Next project</span>
            <span className={styles.nextTitle}>
              {upcoming.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        ) : null}
      </main>
      <footer className={styles.footer}>
        <p>{siteContent.footer.note}</p>
      </footer>
    </>
  )
}
