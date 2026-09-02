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
      'Katarina Ranković is a creative technologist with 8+ years of professional experience building games, realtime systems and interactive experiences, primarily with Unity and C#.',
      'Her work sits between technology, interaction and design, combining a strong engineering background with experimentation across interactive art, XR, AI-enabled experiences and physical–digital systems.',
      'She is particularly interested in projects where technology becomes part of the experience itself — through movement, language, participation, realtime visuals and physical space.',
    ],
    background: {
      title: 'Background',
      body: [
        'Experience across games, VR/AR and realtime software, from gameplay systems and architecture to rapid prototyping, realtime visuals and development tools.',
        'She has worked closely with designers and artists, building technical systems and tools that help turn visual and interactive ideas into working experiences.',
      ],
    },
    /**
     * Ordered so the creative identity reads first and the engineering that
     * supports it reads last.
     */
    capabilities: [
      {
        title: 'Interactive',
        items: [
          'Interactive Experiences',
          'Rapid Prototyping',
          'Games / AR / VR / XR',
          'Physical–Digital Systems',
        ],
      },
      {
        title: 'Realtime & Visual',
        items: [
          'Unity / Unreal Engine',
          'Animation Systems',
          'Particles / VFX / Post-processing',
          'Lighting / Cameras / Materials',
          '3D Asset Pipelines',
          'Basic Shader Work',
        ],
      },
      {
        title: 'AI & Integrations',
        items: [
          'Generative AI',
          'Prompt Design & Optimization',
          'Speech-to-Text / Text-to-Speech',
          'Conversational / Language-learning Systems',
          'NFC / QR / Kiosk Integrations',
        ],
      },
      {
        title: 'Engineering',
        items: [
          'C# / C++',
          'System Architecture',
          'Gameplay Systems',
          'Development & Art Pipeline Tools',
          'Unit Testing / .NET',
        ],
      },
    ],
    /**
     * Real destinations are not known yet. Entries stay here with an empty href
     * and are filtered out at render, so the site never shows a link that goes
     * nowhere. They appear as soon as a real URL is supplied.
     */
    contact: [
      { label: 'CV', href: '' },
      { label: 'Email', href: '' },
      { label: 'LinkedIn', href: '' },
    ],
  },
  footer: {
    note: '© Katarina Ranković',
  },
} as const
