/**
 * Editorial copy. Project entries remain lightly sketched until real work is supplied.
 */
export const siteContent = {
  meta: {
    title: 'Katarina Ranković',
    description: 'Creative technologist working across interactive art, games and digital systems.',
  },
  nav: {
    brand: 'Katarina Ranković',
    links: [
      { label: 'Projects', href: '#projects' },
      { label: 'Playground', href: '#playground' },
      { label: 'About', href: '#about' },
    ],
  },
  hero: {
    title: 'Katarina Ranković',
    lede: 'Creative technologist working across interactive art, games and digital systems.',
  },
  work: {
    eyebrow: '01',
    title: 'Projects',
    items: [
      {
        title: 'Selected work',
        role: 'To be added',
        summary:
          'A first collection of commissioned and self-initiated pieces. Titles and stills will sit here.',
        href: '#projects',
      },
      {
        title: 'Installations',
        role: 'To be added',
        summary:
          'Room-scale and site-specific systems, including work that depends on a visitor being physically present.',
        href: '#projects',
      },
    ],
  },
  playground: {
    eyebrow: '02',
    title: 'Playground',
    items: [
      {
        title: 'Sketches',
        summary: 'Smaller studies, failed directions, and things that do not yet have a name.',
      },
      {
        title: 'Systems',
        summary: 'Tools, toys, and procedural experiments that sit beside the finished work.',
      },
    ],
  },
  about: {
    eyebrow: '03',
    title: 'About',
    body: [
      'I work where software, image and physical space overlap — building things that can be walked around, played with, or simply looked at for a while.',
      'Based between studio practice and digital systems. More writing and a fuller biography will follow.',
    ],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
