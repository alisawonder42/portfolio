import { siteContent } from '@/content/site'

import styles from './Nav.module.css'

export function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <a href="#" className={styles.brand}>
          {siteContent.nav.brand}
        </a>
        <ul className={styles.links}>
          {siteContent.nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
