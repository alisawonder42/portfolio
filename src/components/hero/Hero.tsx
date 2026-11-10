import { useLanguage } from '@/content/Language'

import styles from './Hero.module.css'

export function Hero() {
  const { site: siteContent } = useLanguage()
  const [given, family] = splitName(siteContent.hero.title)
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.given}>{given}</span>
          <span className={styles.family}>{family}</span>
        </h1>
        <div className={styles.interests}>
          <div className={styles.interest}>
            <span className={styles.interestLabel}>{siteContent.hero.technicalLabel}</span>
            <p className={styles.lede}>{siteContent.hero.technical}</p>
          </div>
          <div className={styles.interest}>
            <span className={styles.interestLabel}>{siteContent.hero.artisticLabel}</span>
            <p className={styles.lede}>{siteContent.hero.artistic}</p>
          </div>
          <div className={styles.interest}>
            <span className={styles.interestLabel}>{siteContent.hero.personalLabel}</span>
            <p className={styles.lede}>{siteContent.hero.personal}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return [parts[0], '']
  return [parts.slice(0, -1).join(' '), parts[parts.length - 1]]
}
