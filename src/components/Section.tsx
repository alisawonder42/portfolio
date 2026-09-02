import type { ReactNode } from 'react'

import styles from './Section.module.css'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.header}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  )
}
