/**
 * Site-level copy. Project and experiment content lives in `projects.ts`.
 */
export const siteContent = {
  meta: {
    title: 'Katarina Ranković',
    description:
      'Interested in installations and the creative use of technology in art and design. Exploring how AI can support creativity and creative processes, with a pragmatic approach.',
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
    lede: 'Interested in installations and the creative use of technology in art and design. Exploring how AI can support creativity and creative processes, with a pragmatic approach.',
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
