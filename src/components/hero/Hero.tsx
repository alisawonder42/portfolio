import { useRef } from 'react'

import { BloomScene, DEFAULT_DIRECTION, DIRECTIONS } from '@/bloom'
import { siteContent } from '@/content/site'

import styles from './Hero.module.css'
import { useHeroBloom } from './useHeroBloom'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const getBloom = useHeroBloom(ref)
  const config = DIRECTIONS[DEFAULT_DIRECTION]

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.canvas} aria-hidden="true">
        <BloomScene config={config} getBloom={getBloom} offsetY={-0.05} />
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
