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
      'Katarina Ranković is a creative technologist and software engineer with a BSc in Computer Science and 8+ years of professional experience building games and realtime interactive systems, primarily with Unity and C#.',
      'Based in Serbia, she works across interactive systems, realtime technology and experimental digital experiences, combining a strong engineering background with work in AI-enabled interaction, participatory systems and physical–digital formats.',
    ],
    background: {
      title: 'Background',
      body: [
        'Professional experience across games, VR and realtime software, from gameplay systems and system architecture to development tools and production-scale codebases.',
      ],
    },
    capabilities: [
      { title: 'Realtime', items: ['Unity / Unreal Engine'] },
      { title: 'Code', items: ['C# / C++'] },
      {
        title: 'Systems',
        items: [
          'System Architecture / Gameplay Systems',
          'Unit Testing / Development Tools / .NET',
        ],
      },
      {
        title: 'Creative Technology',
        items: [
          'Interactive Systems / Generative AI',
          'Physical–Digital Interaction / Experimental Interfaces',
        ],
      },
    ],
    /**
     * Destinations are not in the repository. Empty hrefs are filtered out at
     * render so the site never shows a link that goes nowhere.
     */
    contact: [
      { label: 'CV', href: '' },
      { label: 'Email', href: '' },
    ],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
