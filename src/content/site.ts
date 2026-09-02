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
  contact: {
    linkedin: 'https://www.linkedin.com/in/katarina-rankovic-42071b198/',
    email: 'mailto:katarinarankovic42@gmail.com',
  },
  close: {
    links: [
      { label: 'CV', href: '/cv', external: false },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/katarina-rankovic-42071b198/',
        external: true,
      },
      { label: 'Contact', href: 'mailto:katarinarankovic42@gmail.com', external: false },
    ],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
