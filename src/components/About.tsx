import { siteContent } from '@/content/site'

import styles from './About.module.css'

export function About() {
  const { bio, background, capabilities, contact } = siteContent.about
  const links = contact.filter((item) => item.href)

  return (
    <div className={styles.about}>
      <div className={styles.bio}>
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className={styles.block} aria-labelledby="about-background">
        <h3 id="about-background" className={styles.blockTitle}>
          {background.title}
        </h3>
        <div className={styles.backgroundBody}>
          {background.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={styles.block} aria-labelledby="about-capabilities">
        <h3 id="about-capabilities" className={styles.blockTitle}>
          Capabilities
        </h3>
        <dl className={styles.capabilities}>
          {capabilities.map((group) => (
            <div key={group.title} className={styles.group}>
              <dt className={styles.groupTitle}>{group.title}</dt>
              <dd className={styles.groupItems}>
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

      {links.length > 0 ? (
        <ul className={styles.contact}>
          {links.map((item) => (
            <li key={item.label}>
              <a href={item.href}>
                {item.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
