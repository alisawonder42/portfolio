import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { Section } from '@/components/Section'
import { siteContent } from '@/content/site'

import styles from './Home.module.css'

export function Home() {
  const { work, about, contact, footer } = siteContent
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <Section id="work" eyebrow={work.eyebrow} title={work.title}>
          <ul className={styles.workGrid}>
            {work.items.map((item) => (
              <li key={item.title} className={styles.workCard}>
                <a href={item.href} className={styles.workLink}>
                  <div className={styles.workThumb} aria-hidden="true" />
                  <div className={styles.workMeta}>
                    <h3 className={styles.workTitle}>{item.title}</h3>
                    <p className={styles.workRole}>{item.role}</p>
                  </div>
                  <p className={styles.workSummary}>{item.summary}</p>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="about" eyebrow={about.eyebrow} title={about.title}>
          <div className={styles.prose}>
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow={contact.eyebrow} title={contact.title}>
          <div className={styles.contact}>
            <a className={styles.email} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <ul className={styles.socials}>
              {contact.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} rel="me noopener" target="_blank">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>
      <footer className={`container ${styles.footer}`}>
        <p>{footer.note}</p>
        <a href="#/lab" className={styles.labLink}>
          Bloom lab
        </a>
      </footer>
    </>
  )
}
