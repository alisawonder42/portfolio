import { useEffect, useState } from 'react'
import { useLanguage } from '@/content/Language'

import styles from './PlaygroundIndex.module.css'

/** Smaller studies, set lighter than the project index on purpose. */
export function PlaygroundIndex() {
  const { experiments, language } = useLanguage()
  const [visibleImage, setVisibleImage] = useState<{ src: string; alt: string } | null>(null)
  const chronologicalExperiments = [...experiments].sort(
    (a, b) => Number(b.year) - Number(a.year),
  )

  useEffect(() => {
    if (!visibleImage) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisibleImage(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [visibleImage])

  return (
    <>
      <ol className={styles.list}>
        {chronologicalExperiments.map((experiment) => (
          <li key={experiment.title} className={styles.item}>
            <span className={styles.year}>{experiment.year}</span>
            <div className={styles.body}>
              <h3 className={styles.title}>{experiment.title}</h3>
              <p className={styles.type}>{experiment.type}</p>
              {experiment.note ? <p className={styles.note}>{experiment.note}</p> : null}
              {experiment.link ? (
                <a className={styles.note} href={experiment.link} target="_blank" rel="noopener noreferrer">
                  {language === 'sr' ? 'Pogledaj više ↗' : 'See more ↗'}
                </a>
              ) : null}
              {experiment.image ? (
                <button
                  className={styles.seeButton}
                  type="button"
                  onClick={() =>
                    setVisibleImage({
                      src: experiment.image!,
                      alt: experiment.imageAlt ?? experiment.title,
                    })
                  }
                >
                  SEE ↗
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {visibleImage ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={visibleImage.alt}
          onClick={() => setVisibleImage(null)}
        >
          <button
            className={styles.closeButton}
            type="button"
            aria-label={language === 'sr' ? 'Zatvori sliku' : 'Close image'}
            onClick={() => setVisibleImage(null)}
          >
            ×
          </button>
          <img
            className={styles.enlargedImage}
            src={visibleImage.src}
            alt={visibleImage.alt}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
