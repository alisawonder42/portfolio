/**
 * Site-level copy. Project and experiment content lives in `projects.ts`.
 * CV body copy lives in `cv.ts`.
 */
export const siteContent = {
  meta: {
    title: 'Katarina Ranković',
    description: 'Creative technologist working across interactive art, games and digital systems.',
  },
  nav: {
    brand: 'Katarina Ranković',
    links: [
      { label: 'Projects', href: '/#projects' },
      { label: 'Playground', href: '/#playground' },
      { label: 'CV', href: '/cv' },
    ],
  },
  hero: {
    title: 'Katarina Ranković',
    lede: 'Creative technologist working across interactive art, games and digital systems.',
  },
  work: {
    eyebrow: '01',
    title: 'Projects',
    note: 'Selected work',
  },
  playground: {
    eyebrow: '02',
    title: 'Playground',
    note: 'Experiments and studies',
  },
  /**
   * Destinations that are not in the repository stay empty and are omitted
   * at render. Fill these when they exist — do not invent URLs.
   *
   * linkedin: full profile URL, e.g. https://www.linkedin.com/in/…
   * email: mailto: address, e.g. mailto:name@example.com
   */
  contact: {
    linkedin: '',
    email: '',
  },
  close: {
    links: [
      { label: 'CV', href: '/cv', external: false },
      { label: 'LinkedIn', href: '', external: true },
      { label: 'Contact', href: '', external: true },
    ],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
