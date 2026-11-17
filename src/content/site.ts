/**
 * Site-level copy. Project and experiment content lives in `projects.ts`.
 */
export const siteContent = {
  meta: {
    title: 'Katarina Ranković',
    description:
      'I am interested in new technologies and the possibilities they open up.',
  },
  nav: {
    brand: 'Katarina Ranković',
    links: [
      { label: 'Projects', href: '/#projects' },
      { label: 'Playground', href: '/#playground' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  hero: {
    title: 'Katarina Ranković',
    technicalLabel: 'Technically',
    technical: 'I am interested in new technologies and the possibilities they open up.',
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
  background: {
    degree: 'BSc Computer Science',
    university: 'University of Novi Sad',
  },
  contact: {
    label: 'Contact me',
    gamesLabel: 'Game development experience',
    gamesUrl: 'https://www.katarinagames.fyi/',
    linkedin: '',
    email: 'mailto:katarinarankovic42@gmail.com',
  },
  close: {
    links: [{ label: 'Contact', href: '', external: true }],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
