import { useLanguage } from '@/content/Language'
import { Link } from '@/app/Link'
import { projectPath } from '@/content/projects'

import styles from './ProjectIndex.module.css'

/**
 * A text-only index. Documentation belongs on the project pages; here the list
 * stays quiet so the sculpture remains the image on the page.
 */
export function ProjectIndex() {
  const { projects } = useLanguage()
  const visibleProjects = projects
    .filter((project) => project.slug !== 'mladen-ilic')
    .sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0))

  return (
    <ol className={styles.list}>
      {visibleProjects.map((project) => (
        <li key={project.slug} className={styles.item}>
          <Link className={styles.row} href={projectPath(project.slug)}>
            <span className={styles.year}>{project.year ?? '—'}</span>
            <span className={styles.body}>
              <span className={styles.title}>{project.title}</span>
              <span className={styles.type}>{project.type}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
