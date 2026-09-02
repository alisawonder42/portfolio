/**
 * Site-level copy. Project and experiment content lives in `projects.ts`.
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
      { label: 'About', href: '/#about' },
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
  about: {
    eyebrow: '03',
    title: 'About',
    bio: [
      'Katarina Ranković is a creative technologist with a background in computer science and professional experience across video games, VR and interactive digital systems.',
      'Her practice explores how technology can operate as both a creative medium and a system for shaping participation, perception and communication.',
      'She is particularly interested in interactive, participatory and experimental formats, and in work connecting physical space with digital layers and responsive systems.',
    ],
    practice: {
      title: 'Practice',
      body: 'Alongside her independent creative practice, Katarina has more than eight years of experience building games and realtime interactive systems.',
    },
    capabilities: [
      { title: 'Realtime', items: ['Unity', 'Unreal', 'Babylon.js', 'WebGL'] },
      { title: 'Engineering', items: ['C#', 'C++', 'TypeScript', '.NET'] },
      {
        title: 'Systems',
        items: [
          'Realtime architecture',
          'Interaction design',
          'Gameplay systems',
          'Tooling',
          'Creative technology',
        ],
      },
    ],
    /**
     * Real destinations are not known yet. Entries stay here with an empty href
     * and are not rendered, so the site never shows a link that goes nowhere.
     */
    contact: [
      { label: 'CV', href: '' },
      { label: 'Email', href: '' },
      { label: 'LinkedIn', href: '' },
      { label: 'GitHub', href: '' },
    ],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
