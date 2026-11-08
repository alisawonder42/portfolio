import { useLanguage } from '@/content/Language'
import { Link } from '@/app/Link'
import { Nav } from '@/components/Nav'

import styles from './ProjectPage.module.css'

export function NotFound() {
  const { t } = useLanguage()
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('Not found', 'Stranica nije pronađena')}</h1>
          <p className={styles.meta}>{t('This page does not exist', 'Ova stranica ne postoji')}</p>
        </header>
        <Link className={styles.back} href="/">
          <span aria-hidden="true">←</span> {t('Home', 'Početna')}
        </Link>
      </main>
    </>
  )
}
