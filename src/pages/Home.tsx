import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { PlaygroundIndex } from '@/components/PlaygroundIndex'
import { ProjectIndex } from '@/components/ProjectIndex'
import { Section } from '@/components/Section'
import { useLanguage } from '@/content/Language'
import { OrganismScene } from '@/organism/OrganismScene'

import styles from './Home.module.css'

function ContactLink() {
  const { site: siteContent } = useLanguage()
  const email = siteContent.contact.email

  return (
    <footer id="contact" className={styles.close}>
      <div className={styles.profileDetails}>
        <p className={styles.profileRow}>
          <span className={styles.profileLead}>{siteContent.background.consultantRole}</span>
          <a
            className={styles.profileLink}
            href={siteContent.background.consultantUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteContent.background.consultantOrg} <span aria-hidden="true">↗</span>
          </a>
        </p>
        <p className={styles.profileRow}>
          <span className={styles.profileLead}>{siteContent.background.degree}</span>
          <span>· {siteContent.background.university}</span>
        </p>
      </div>
      <div className={styles.contactLinks}>
        <a className={styles.sendButton} href={email}>
          {siteContent.contact.label} <span aria-hidden="true">↗</span>
        </a>
        <a
          className={styles.sendButton}
          href={siteContent.contact.gamesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {siteContent.contact.gamesLabel} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <a
        className={styles.lifeLink}
        href="https://www.instagram.com/katarina___rankovic/"
        target="_blank"
        rel="noopener noreferrer"
      >
        life:in progress <span aria-hidden="true">↗</span>
      </a>
    </footer>
  )
}

export function Home() {
  const { site: siteContent } = useLanguage()
  const { work, playground } = siteContent
  return (
    <>
      <div className={styles.stage} aria-hidden="true">
        <OrganismScene />
      </div>
      <Nav />
      <main className={styles.main}>
        <Hero />

        <Section id="projects" eyebrow={work.eyebrow} title={work.title} note={work.note}>
          <ProjectIndex />
        </Section>

        <Section
          id="playground"
          eyebrow={playground.eyebrow}
          title={playground.title}
          note={playground.note}
        >
          <PlaygroundIndex />
        </Section>
      </main>
      <ContactLink />
    </>
  )
}
