import { siteContent } from '@/content/site'

import styles from './Hero.module.css'

export function Hero() {
  const [given, family] = splitName(siteContent.hero.title)
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.given}>{given}</span>
          <span className={styles.family}>{family}</span>
        </h1>
        <p className={styles.lede}>{siteContent.hero.lede}</p>
      </div>
    </section>
  )
}

function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return [parts[0], '']
  return [parts.slice(0, -1).join(' '), parts[parts.length - 1]]
}
