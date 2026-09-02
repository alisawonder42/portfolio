import { Link } from '@/app/Link'
import { Nav } from '@/components/Nav'
import { cvContent } from '@/content/cv'
import { siteContent } from '@/content/site'

import styles from './CvPage.module.css'

function metaLine(job: (typeof cvContent.experience)[number]) {
  return [job.employmentType, job.workMode, job.location].filter(Boolean).join(' · ')
}

export function CvPage() {
  const email = siteContent.contact.email
  const linkedin = siteContent.contact.linkedin

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.name}>{cvContent.name}</h1>
          <p className={styles.headline}>{cvContent.headline}</p>
          <ul className={styles.headerLinks}>
            <li>
              <a href={email}>katarinarankovic42@gmail.com</a>
            </li>
            <li>
              <a href={linkedin} target="_blank" rel="noreferrer noopener">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </header>

        <section className={styles.section} aria-labelledby="cv-profile">
          <h2 id="cv-profile" className={styles.sectionTitle}>
            01 — Profile
          </h2>
          <div className={styles.body}>
            {cvContent.profile.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="cv-experience">
          <h2 id="cv-experience" className={styles.sectionTitle}>
            02 — Experience
          </h2>
          <div className={styles.entries}>
            {cvContent.experience.map((job) => (
              <article key={`${job.company}-${job.start}`} className={styles.entry}>
                <div className={styles.entryHead}>
                  <div>
                    <h3 className={styles.entryRole}>{job.role}</h3>
                    <p className={styles.entryCompany}>{job.company}</p>
                  </div>
                  <p className={styles.entryDates}>
                    {job.start} — {job.end}
                  </p>
                </div>
                <p className={styles.entryMeta}>{metaLine(job)}</p>
                {job.description.map((paragraph) => (
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
            03 — Education
          </h2>
          <div className={styles.entries}>
            {cvContent.education.map((item) => (
              <article key={item.school} className={styles.entry}>
                <div className={styles.entryHead}>
                  <div>
                    <h3 className={styles.entryRole}>{item.title}</h3>
                    <p className={styles.entryCompany}>
                      {item.school}, {item.faculty}
                    </p>
                  </div>
                  <p className={styles.entryDates}>{item.dates}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="cv-capabilities">
          <h2 id="cv-capabilities" className={styles.sectionTitle}>
            04 — Capabilities
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

        <section className={styles.section} aria-labelledby="cv-languages">
          <h2 id="cv-languages" className={styles.sectionTitle}>
            05 — Languages
          </h2>
          <ul className={styles.plainList}>
            {cvContent.languages.map((item) => (
              <li key={item.name}>
                {item.name} — {item.level}
              </li>
            ))}
          </ul>
        </section>

        <ul className={styles.contact}>
          <li>
            <a href={email}>
              Email <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a href={linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <Link href="/#projects">
              Back to work <span aria-hidden="true">↗</span>
            </Link>
          </li>
        </ul>
      </main>
    </>
  )
}
