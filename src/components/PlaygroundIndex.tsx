import { useLanguage } from '@/content/Language'

import styles from './PlaygroundIndex.module.css'

/** Smaller studies, set lighter than the project index on purpose. */
export function PlaygroundIndex() {
  const { experiments, language } = useLanguage()
  return (
    <ol className={styles.list}>
      {experiments.map((experiment, index) => (
        <li key={experiment.title} className={styles.item}>
          <span className={styles.index}>{String(index + 1).padStart(3, '0')}</span>
          <div className={styles.body}>
            <h3 className={styles.title}>{experiment.title}</h3>
            <p className={styles.type}>{experiment.type}</p>
            {experiment.note ? <p className={styles.note}>{experiment.note}</p> : null}
            {experiment.link ? (
              <a className={styles.note} href={experiment.link} target="_blank" rel="noopener noreferrer">
                {language === 'sr' ? 'Pogledaj više ↗' : 'See more ↗'}
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
