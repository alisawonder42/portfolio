import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { Section } from '@/components/Section'
import { siteContent } from '@/content/site'
import { OrganismScene } from '@/organism/OrganismScene'

import styles from './Home.module.css'

export function Home() {
  const { work, playground, about, footer } = siteContent
  return (
    <>
      <div className={styles.stage} aria-hidden="true">
        <OrganismScene />
      </div>
      <Nav />
      <main className={styles.main}>
        <Hero />

        <Section id="projects" eyebrow={work.eyebrow} title={work.title}>
          <ul className={styles.list}>
            {work.items.map((item) => (
              <li key={item.title} className={styles.entry}>
                <h3 className={styles.entryTitle}>{item.title}</h3>
                <p className={styles.entryRole}>{item.role}</p>
                <p className={styles.entrySummary}>{item.summary}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="playground" eyebrow={playground.eyebrow} title={playground.title}>
          <ul className={styles.list}>
            {playground.items.map((item) => (
              <li key={item.title} className={styles.entry}>
                <h3 className={styles.entryTitle}>{item.title}</h3>
                <p className={styles.entrySummary}>{item.summary}</p>
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
      </main>
      <footer className={styles.footer}>
        <p>{footer.note}</p>
      </footer>
    </>
  )
}
