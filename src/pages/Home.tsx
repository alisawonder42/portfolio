import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { PlaygroundIndex } from '@/components/PlaygroundIndex'
import { ProjectIndex } from '@/components/ProjectIndex'
import { Section } from '@/components/Section'
import { useLanguage } from '@/content/Language'
import { OrganismScene } from '@/organism/OrganismScene'

import styles from './Home.module.css'

function ContactLink() {
  const { site: siteContent, t } = useLanguage()

  return (
    <Section id="contact" eyebrow="03" title={t('Elsewhere', 'Ostalo')} note="Social · games · contact">
      <ol className={styles.socialList}>
        <li className={styles.socialItem}>
          <span className={styles.socialIndex}>00</span>
          <a
            className={styles.socialLink}
            href="https://www.instagram.com/katarina___rankovic/"
            target="_blank"
            rel="noopener noreferrer"
          >
            social:maybe <span aria-hidden="true">↗</span>
          </a>
        </li>
        <li className={styles.socialItem}>
          <span className={styles.socialIndex}>01</span>
          <a className={styles.socialLink} href={siteContent.contact.email}>
            contact:me <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ol>
      <div className={styles.profileDetails}>
        <a
          className={styles.techSide}
          href={siteContent.contact.gamesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          tech:side <span aria-hidden="true">↗</span>
        </a>
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
    </Section>
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
