import { experiments } from '@/content/projects'

import styles from './PlaygroundIndex.module.css'

/** Smaller studies, set lighter than the project index on purpose. */
export function PlaygroundIndex() {
  return (
    <ol className={styles.list}>
      {experiments.map((experiment, index) => (
        <li key={experiment.title} className={styles.item}>
          <span className={styles.index}>{String(index + 1).padStart(3, '0')}</span>
          <div className={styles.body}>
            <h3 className={styles.title}>{experiment.title}</h3>
            <p className={styles.type}>{experiment.type}</p>
            {experiment.note ? <p className={styles.note}>{experiment.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
