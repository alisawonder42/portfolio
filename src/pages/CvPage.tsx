import { Link } from '@/app/Link'
import { Nav } from '@/components/Nav'
import { cvContent } from '@/content/cv'
import { siteContent } from '@/content/site'

import styles from './CvPage.module.css'

export function CvPage() {
  const email = siteContent.contact.email as string
  const linkedin = siteContent.contact.linkedin as string
  const contact: { label: string; href: string; external?: boolean }[] = []
  if (email) contact.push({ label: 'Email', href: email })
  if (linkedin) contact.push({ label: 'LinkedIn', href: linkedin, external: true })

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <Link className={styles.back} href="/">
          <span aria-hidden="true">←</span> Home
        </Link>

        <header className={styles.header}>
          <p className="eyebrow">
            {cvContent.eyebrow} / {cvContent.title}
          </p>
          <h1 className={styles.name}>{cvContent.name}</h1>
          <p className={styles.headline}>{cvContent.headline}</p>
        </header>

        <section className={styles.section} aria-labelledby="cv-profile">
          <h2 id="cv-profile" className={styles.sectionTitle}>
            Profile
          </h2>
          <div className={styles.body}>
            {cvContent.profile.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="cv-experience">
          <h2 id="cv-experience" className={styles.sectionTitle}>
            Experience
          </h2>
          <div className={styles.entries}>
            {cvContent.experience.map((job) => (
              <article key={job.title} className={styles.entry}>
                <h3 className={styles.entryTitle}>{job.title}</h3>
                <p className={styles.entryMeta}>
                  {[job.role, job.place].filter(Boolean).join(' · ')}
                </p>
                {job.summary.map((paragraph) => (
                  <p key={paragraph} className={styles.entryBody}>
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="cv-education">
          <h2 id="cv-education" className={styles.sectionTitle}>
            Education
          </h2>
          <ul className={styles.plainList}>
            {cvContent.education.map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="cv-capabilities">
          <h2 id="cv-capabilities" className={styles.sectionTitle}>
            Capabilities
          </h2>
          <dl className={styles.capabilities}>
            {cvContent.capabilities.map((group) => (
              <div key={group.title} className={styles.group}>
                <dt>{group.title}</dt>
                <dd>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {contact.length ? (
          <section className={styles.section} aria-labelledby="cv-contact">
            <h2 id="cv-contact" className={styles.sectionTitle}>
              Contact
            </h2>
            <ul className={styles.contact}>
              {contact.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer noopener">
                      {item.label} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <a href={item.href}>
                      {item.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </>
  )
}
