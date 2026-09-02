import { Link } from '@/app/Link'
import { Nav } from '@/components/Nav'

import styles from './ProjectPage.module.css'

export function NotFound() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Not found</h1>
          <p className={styles.meta}>This page does not exist</p>
        </header>
        <Link className={styles.back} href="/">
          <span aria-hidden="true">←</span> Home
        </Link>
      </main>
    </>
  )
}
