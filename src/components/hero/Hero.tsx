import { siteContent } from '@/content/site'

import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>
          {siteContent.hero.title}
        </h1>
        <p className={styles.lede}>{siteContent.hero.lede}</p>
      </div>
    </section>
  )
}
