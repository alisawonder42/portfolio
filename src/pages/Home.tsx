import { Hero } from '@/components/hero/Hero'
import { Nav } from '@/components/Nav'
import { PlaygroundIndex } from '@/components/PlaygroundIndex'
import { ProjectIndex } from '@/components/ProjectIndex'
import { Section } from '@/components/Section'
import { siteContent } from '@/content/site'
import { OrganismScene } from '@/organism/OrganismScene'

import styles from './Home.module.css'

function ContactForm() {
  const email = siteContent.contact.email.replace(/^mailto:/, '')

  return (
    <footer id="contact" className={styles.close}>
      <h2 className={styles.contactTitle}>Contact</h2>
      <form
        className={styles.contactForm}
        action={`https://formsubmit.co/${email}`}
        method="POST"
      >
        <input type="hidden" name="_subject" value="New message from your portfolio" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_url" value="https://katarinarankovic.fyi/#contact" />
        <input
          className={styles.honeypot}
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <label className={styles.field} htmlFor="contact-name">
          Name
          <input id="contact-name" name="name" autoComplete="name" maxLength={120} required />
        </label>
        <label className={styles.field} htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>
        <label className={styles.field} htmlFor="contact-message">
          Message
          <textarea id="contact-message" name="message" rows={5} maxLength={5000} required />
        </label>
        <button className={styles.sendButton} type="submit">
          Send message <span aria-hidden="true">↗</span>
        </button>
        <p className={styles.deliveryNote}>Messages are delivered via FormSubmit.</p>
      </form>
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
      <ContactForm />
    </>
  )
}
