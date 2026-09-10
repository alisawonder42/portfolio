import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { PlaygroundIndex } from '@/components/PlaygroundIndex'
import { ProjectIndex } from '@/components/ProjectIndex'
import { Section } from '@/components/Section'
import { siteContent } from '@/content/site'
import { OrganismScene } from '@/organism/OrganismScene'

import styles from './Home.module.css'

function CloseLinks() {
  const email = siteContent.contact.email

  return (
    <footer id="contact" className={styles.close}>
      <ul className={styles.closeLinks}>
        <li>
          <a href={email}>
            Contact <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </footer>
  )
}

export function Home() {
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
      <CloseLinks />
    </>
  )
}
