import { useEffect, useState } from 'react'

import { Link } from '@/app/Link'
import { Nav } from '@/components/Nav'
import {
  projectPath,
  type Project,
  type ProjectMedia,
  type ProjectSection,
} from '@/content/projects'
import { useLanguage } from '@/content/Language'

import styles from './ProjectPage.module.css'

function InlineText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\*\*[^*]+\*\*)/g)
        .map((part, index) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
    </>
  )
}

function SectionBlock({ section }: { section: ProjectSection }) {
  return (
    <section className={styles.section}>
      {section.title ? <h2 className={styles.sectionTitle}>{section.title}</h2> : null}
      <div className={styles.sectionBody}>
        {section.highlight ? <p className={styles.highlight}>{section.highlight}</p> : null}
        {section.content?.map((paragraph) => (
          <p key={paragraph}>
            <InlineText text={paragraph} />
          </p>
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

function Contribution({ items }: { items: string[] }) {
  const asProse = items.some((item) => item.length > 90)

  if (asProse) {
    return (
      <>
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </>
    )
  }

  return (
    <ul className={styles.contribution}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function Embed({ src, title }: { src: string; title: string }) {
  const { t } = useLanguage()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const origin = (() => {
      try {
        return new URL(src, window.location.href).origin
      } catch {
        return ''
      }
    })()

    const onMessage = (event: MessageEvent) => {
      if (origin && event.origin !== origin) return
      const data = event.data
      if (data && data.source === 'boxpreview' && data.type === 'ready') {
        setReady(true)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [src])

  return (
    <figure className={styles.embed} data-ready={ready || undefined}>
      {ready ? null : (
        <p className={styles.embedStatus} aria-live="polite">
          {t('Loading', 'Učitavanje')}
        </p>
      )}
      <iframe
        src={src}
        title={title}
        allow="fullscreen"
        onLoad={() => {
          window.setTimeout(() => setReady(true), 5000)
        }}
      />
    </figure>
  )
}

function MediaFigure({ item }: { item: ProjectMedia }) {
  const media =
    item.kind === 'video' ? (
      <video src={item.src} aria-label={item.alt} controls playsInline preload="metadata" />
    ) : (
      <img src={item.src} alt={item.alt} loading="lazy" />
    )

  return (
    <figure className={styles.figure}>
      {item.href ? (
        <a className={styles.mediaLink} href={item.href} target="_blank" rel="noreferrer noopener">
          {media}
        </a>
      ) : (
        media
      )}
      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
    </figure>
  )
}

export function ProjectPage({ project }: { project: Project }) {
  const { projects, site: siteContent, t, language } = useLanguage()
  const upcoming =
    projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length]
  const meta = [project.type, project.year].filter(Boolean).join(' · ')
  const hasSpec = Boolean(project.kindLabel || project.credit || project.location)
  const showType = Boolean(
    project.type && (!project.kindLabel || project.type !== project.kindLabel),
  )

  return (
    <>
      <Nav />
      <main className={`${styles.page} ${project.slug === 'unseen' ? styles.exhibition : ''}`}>
        <Link className={styles.back} href="/#projects">
          <span aria-hidden="true">←</span> {t('Projects', 'Projekti')}
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          {hasSpec ? (
            <dl className={styles.spec}>
              {project.location ? (
                <div>
                  <dt>{t('Location', 'Lokacija')}</dt>
                  <dd>{project.location}</dd>
                </div>
              ) : null}
              {project.credit ? (
                <div>
                  <dt>{t('Role', 'Uloga')}</dt>
                  <dd>{project.credit}</dd>
                </div>
              ) : null}
              {project.kindLabel ? (
                <div>
                  <dt>{t('Project type', 'Vrsta projekta')}</dt>
                  <dd>{project.kindLabel}</dd>
                </div>
              ) : null}
              {showType ? (
                <div>
                  <dt>{t('Type', 'Vrsta')}</dt>
                  <dd>{project.type}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className={styles.meta}>{meta}</p>
          )}
          {project.tags?.length ? <p className={styles.tags}>{project.tags.join(' · ')}</p> : null}
          {project.collaboration ? (
            <p className={styles.collaboration}>
              {project.collaboration}
              {project.collaborationLink ? (
                <>
                  {' '}
                  <a
                    href={project.collaborationLink.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {project.collaborationLink.label}
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </header>

        {project.slug === 'unseen' ? (
          <section
            className={styles.catalogue}
            aria-label={t('Exhibition catalogue', 'Katalog izložbe')}
          >
            <div className={styles.cataloguePages}>
              {[1, 2, 3, 4].map((pageNumber) => (
                <figure className={styles.catalogueFigure} key={pageNumber}>
                  <img
                    src={`/projects/unseen/catalogue/${language}/page-${pageNumber}.jpg`}
                    alt={t(
                      `un:seen exhibition catalogue, page ${pageNumber} of 4`,
                      `Katalog izložbe un:seen, strana ${pageNumber} od 4`,
                    )}
                    loading={pageNumber === 1 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {project.slug === 'box' && project.embed ? (
          <Embed src={project.embed.src} title={project.embed.title} />
        ) : null}

        {project.overview ? <p className={styles.overview}>{project.overview}</p> : null}

        {project.slug !== 'box' && project.embed ? (
          <Embed src={project.embed.src} title={project.embed.title} />
        ) : null}

        {project.embed && project.slug !== 'box' && project.media?.length ? (
          <div className={`${styles.media} ${styles.mediaWithEmbed}`}>
            {project.media.map((item) => (
              <MediaFigure key={item.src} item={item} />
            ))}
          </div>
        ) : null}

        {project.role ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('About the project', 'O projektu')}</h2>
            <div className={styles.sectionBody}>
              <p>{project.role}</p>
            </div>
          </section>
        ) : null}

        {project.contribution?.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('My contribution', 'Moj doprinos')}</h2>
            <div className={styles.sectionBody}>
              <Contribution items={project.contribution} />
            </div>
          </section>
        ) : null}

        {project.sections?.map((section, index) => (
          <div key={section.title ?? section.content?.[0] ?? section.highlight} className={styles.sectionGroup}>
            <SectionBlock section={section} />
            {project.slug === 'box' && index === 1 && project.media?.length ? (
              <div className={styles.media}>
                {project.media.map((item) => (
                  <MediaFigure key={item.src} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {!project.embed && project.slug !== 'unseen' && project.media?.length ? (
          <div className={styles.media}>
            {project.media.map((item) => (
              <MediaFigure key={item.src} item={item} />
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

        {project.slug === 'unseen' && project.media?.length ? (
          <div className={styles.media}>
            {project.media.map((item) => (
              <MediaFigure key={item.src} item={item} />
            ))}
          </div>
        ) : null}

        {upcoming ? (
          <Link className={styles.next} href={projectPath(upcoming.slug)}>
            <span className={styles.nextLabel}>{t('Next project', 'Sledeći projekat')}</span>
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
