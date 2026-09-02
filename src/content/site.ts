/**
 * All human-readable copy lives here so it can be replaced without touching
 * layout code. Everything below is placeholder text awaiting real content.
 */
export const siteContent = {
  meta: {
    title: 'Katarina Rankovic',
    description: 'Selected work and notes.',
  },
  nav: {
    brand: 'Katarina Rankovic',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    eyebrow: 'Portfolio — 2026',
    title: 'Work that opens up on closer inspection.',
    lede: 'Placeholder introduction. One or two sentences on who you are, what you make, and the kind of problems you like to take on.',
    primaryCta: 'See the work',
    secondaryCta: 'Get in touch',
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Projects',
    items: [
      {
        title: 'Project One',
        role: 'Role · Year',
        summary:
          'Placeholder summary. What the project was, what you did, and what changed because of it.',
        href: '#',
      },
      {
        title: 'Project Two',
        role: 'Role · Year',
        summary: 'Placeholder summary. Keep each one to two or three sentences.',
        href: '#',
      },
      {
        title: 'Project Three',
        role: 'Role · Year',
        summary: 'Placeholder summary. The grid supports any number of entries.',
        href: '#',
      },
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'A short bio goes here.',
    body: [
      'Placeholder paragraph one. Where you are, what you have worked on, and what you care about in the work.',
      'Placeholder paragraph two. Tools, collaborators, or a line about what you are looking for next.',
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Say hello.',
    email: 'hello@example.com',
    links: [
      { label: 'GitHub', href: 'https://github.com/alisawonder42' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
  footer: {
    note: '© 2026 Katarina Rankovic',
  },
} as const
