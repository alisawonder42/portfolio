import { Link } from '@/app/Link'
import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { PlaygroundIndex } from '@/components/PlaygroundIndex'
import { ProjectIndex } from '@/components/ProjectIndex'
import { Section } from '@/components/Section'
import { siteContent } from '@/content/site'
import { OrganismScene } from '@/organism/OrganismScene'

import styles from './Home.module.css'

function CloseLinks() {
  const links = siteContent.close.links
    .map((link) => {
      if (link.label === 'LinkedIn')
        return { ...link, href: siteContent.contact.linkedin as string }
      if (link.label === 'Contact') return { ...link, href: siteContent.contact.email as string }
      return { ...link, href: link.href as string }
    })
    .filter((link) => link.href)

  if (!links.length) return null

  return (
    <footer id="close" className={styles.close}>
      <ul className={styles.closeLinks}>
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noreferrer noopener">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link href={link.href}>
                {link.label} <span aria-hidden="true">↗</span>
              </Link>
            )}
          </li>
        ))}
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
