/**
 * Project and experiment content.
 *
 * Everything here is either supplied directly or already established elsewhere
 * in the site. Nothing is inferred: where a fact is not known — a year, a
 * collaborator, a technical detail — the field is left out rather than guessed,
 * so an empty field always means "still to be supplied" and never "invented".
 */

export interface ProjectSection {
  title: string
  /** Body paragraphs. */
  content?: string[]
  /** An ordered flow, rendered as a numbered list. */
  steps?: string[]
  /** A single line set apart from the body. */
  highlight?: string
}

export type ProjectMediaKind = 'image' | 'video' | 'diagram'

export interface ProjectMedia {
  kind: ProjectMediaKind
  src: string
  alt: string
  caption?: string
}

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  title: string
  /** Shown under the title on the index and on the project page. */
  type: string
  year?: string
  /** Secondary descriptors, joined with a separator. */
  tags?: string[]
  /** One restrained line for the homepage index. */
  homepageDescription?: string
  /** Opening paragraph of the project page. */
  overview?: string
  /** How the work was made and by whom, for pieces authored by others. */
  role?: string
  contribution?: string[]
  sections?: ProjectSection[]
  /** Documentation lives on the project page, never on the homepage. */
  media?: ProjectMedia[]
  externalLinks?: ProjectLink[]
}

export const projects: Project[] = [
  {
    slug: 'flat',
    title: 'FLAT',
    type: 'Interactive installation',
    tags: ['AI', 'Participation', 'Perception'],
    homepageDescription: 'Perception, language and generative media.',
    overview:
      'FLAT explores how direct experience changes as it moves through perception, language and digital media.',
    sections: [
      {
        title: 'The installation',
        content: [
          'At the centre of the installation is a painting, The Burden of a Conscious Mind — 80 × 80 cm, oil and gesso on canvas. Its surface is strongly textured, close to relief, built up through layering and a prolonged material process.',
          'Nine screens are installed beside it. Visitors look at the physical painting and describe what they see using their phones.',
          'The generative model never sees the painting. It receives only the visitor’s description, and from that text alone it produces a new visual interpretation.',
        ],
      },
      {
        title: 'Interaction',
        steps: [
          'A visitor encounters the original painting.',
          'They observe it.',
          'They describe it through their phone.',
          'The generative model receives the text only.',
          'A new visual interpretation is generated.',
          'The interpretation appears on the screens.',
        ],
      },
      {
        title: 'Translation',
        highlight: 'physical object → perception → language → digital data → digital image',
        content: [
          'At each transition something is preserved, something changes, and something escapes.',
        ],
      },
      {
        title: 'Attention',
        content: [
          'The apparently flattening digital process produces the opposite effect. To translate the painting into language, a viewer has to slow down and attend more closely to surface, light, colour, texture and detail.',
          'The digital channel does not replace physical experience. It redirects attention toward what cannot be fully transmitted through it: materiality, depth, duration, presence.',
        ],
      },
    ],
    media: [],
  },
  {
    slug: 'shrinkme',
    title: 'ShrinkMe',
    type: 'AR · AI · Voice Interaction',
    tags: ['Interactive character experiment'],
    homepageDescription: 'A prototype built in about four days.',
    overview:
      'ShrinkMe is an experimental prototype, built in approximately four days, combining augmented reality with voice interaction and generated dialogue.',
    sections: [
      {
        title: 'The prototype',
        content: [
          'Users place virtual therapist characters into their physical surroundings, speak to them, and receive generated responses that are voiced and animated.',
          'The experiment sits at the meeting point of voice input, text generation, animated characters and augmented reality. It is a prototype rather than a finished product.',
        ],
      },
    ],
    media: [],
  },
  {
    slug: 'the-book-of-distance',
    title: 'The Book of Distance',
    type: 'Narrative VR Experience',
    homepageDescription: 'Final-stage technical work on an immersive narrative piece.',
    overview: 'The Book of Distance is an immersive narrative VR experience.',
    role: 'Katarina contributed during the final production phase. The work was conceived and directed by others.',
    contribution: [
      'Performance optimization',
      'Profiling',
      'Bug fixing',
      'Technical stability',
      'Realtime rendering and interaction polish',
    ],
    media: [],
  },
  {
    slug: 'lilys-garden',
    title: "Lily's Garden",
    type: 'Realtime Game Systems · LiveOps',
    homepageDescription: 'Live features and systems work on a large realtime title.',
    overview:
      "Lily's Garden is a large live mobile title. Katarina worked as part of the development team, building and maintaining features under a frequent release cycle.",
    contribution: [
      'New gameplay and features',
      'Live updates on a weekly release cadence',
      'Work across a large legacy realtime codebase',
      'Internal tools and workflow optimization',
      'Stability under frequent releases',
      'Architecture and engineering decisions',
    ],
    media: [],
  },
]

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function nextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index < 0 || projects.length < 2) return undefined
  return projects[(index + 1) % projects.length]
}

export function projectPath(slug: string): string {
  return `/projects/${slug}`
}

export interface Experiment {
  title: string
  type: string
  note?: string
}

/** Smaller studies. Lighter in weight than the project index by design. */
export const experiments: Experiment[] = [
  {
    title: 'Proto',
    type: 'Systems / Architecture Study',
    note: 'A small demo of scalable Unity architecture using Zenject, MVC and unit testing. Also used for teaching.',
  },
  {
    title: 'Thomas Was Alone — Remake',
    type: 'Early Gameplay Experiment · 2016',
    note: 'A first Unity project, kept as a starting point rather than as current work.',
  },
]
