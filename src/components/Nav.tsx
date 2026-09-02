import { Link } from '@/app/Link'
import { siteContent } from '@/content/site'

import styles from './Nav.module.css'

export function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
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
      </nav>
    </header>
  )
}
