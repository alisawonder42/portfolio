import { Link } from '@/app/Link'
import { useLanguage } from '@/content/Language'

import styles from './Nav.module.css'

export function Nav() {
  const { site: siteContent, language, setLanguage, t } = useLanguage()
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={t('Primary', 'Glavna navigacija')}>
        <Link href="/" className={styles.brand}>
          {siteContent.nav.brand}
        </Link>
        <ul className={styles.links}>
          {siteContent.nav.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className={styles.languages} role="group" aria-label={t('Language', 'Jezik')}>
          <button
            type="button"
            lang="en"
            aria-label="English"
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            lang="sr-Latn"
            aria-label="Srpski"
            aria-pressed={language === 'sr'}
            onClick={() => setLanguage('sr')}
          >
            SR
          </button>
        </div>
      </nav>
    </header>
  )
}
