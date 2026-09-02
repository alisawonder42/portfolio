import type { ReactNode } from 'react'

import styles from './Section.module.css'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  /** A small standfirst under the title, e.g. "Selected work". */
  note?: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, note, children }: SectionProps) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.header}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`} className={styles.title}>
          {title}
        </h2>
        {note ? <p className={styles.note}>{note}</p> : null}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
