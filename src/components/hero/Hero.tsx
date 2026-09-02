import { useRef } from 'react'

import { siteContent } from '@/content/site'
import { PrototypeScene } from '@/organism/PrototypeScene'

import styles from './Hero.module.css'

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.canvas} aria-hidden="true">
        <PrototypeScene />
      </div>
      <div className={`container ${styles.copy}`}>
        <p className="eyebrow">{siteContent.hero.eyebrow}</p>
        <h1 id="hero-title" className={styles.title}>
          {siteContent.hero.title}
        </h1>
        <p className={styles.lede}>{siteContent.hero.lede}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#work">
            {siteContent.hero.primaryCta}
          </a>
          <a className={styles.secondary} href="#contact">
            {siteContent.hero.secondaryCta}
          </a>
        </div>
      </div>
      <div className={styles.scrollHint} aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
