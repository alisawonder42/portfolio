import { siteContent } from '@/content/site'

import styles from './About.module.css'

export function About() {
  const { bio, practice, capabilities, contact } = siteContent.about
  const links = contact.filter((item) => item.href)

  return (
    <div className={styles.about}>
      <div className={styles.bio}>
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className={styles.block} aria-labelledby="about-practice">
        <h3 id="about-practice" className={styles.blockTitle}>
          {practice.title}
        </h3>
        <p className={styles.practice}>{practice.body}</p>
      </section>

      <section className={styles.block} aria-labelledby="about-capabilities">
        <h3 id="about-capabilities" className={styles.blockTitle}>
          Capabilities
        </h3>
        <dl className={styles.capabilities}>
          {capabilities.map((group) => (
            <div key={group.title} className={styles.group}>
              <dt className={styles.groupTitle}>{group.title}</dt>
              <dd className={styles.groupItems}>{group.items.join(' / ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      {links.length > 0 ? (
        <section className={styles.block} aria-labelledby="about-contact">
          <h3 id="about-contact" className={styles.blockTitle}>
            Contact
          </h3>
          <ul className={styles.contact}>
            {links.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
