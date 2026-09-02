/**
 * Project and experiment content.
 *
 * Everything here is either supplied directly or already established elsewhere
 * in the site. Nothing is inferred: where a fact is not known — a year, a
 * collaborator, a piece of technology — the field is left out rather than
 * guessed, so an empty field always means "still to be supplied" and never
 * "invented". For work made by others, `role` describes the project and
 * `contribution` describes only what Katarina did.
 */

export interface ProjectSection {
  title: string
  /** Body paragraphs. */
  content?: string[]
  /** An ordered flow, rendered as a numbered list. */
  steps?: string[]
  /** An unordered list of concrete elements. */
  items?: string[]
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
  /** Secondary descriptors, joined with a separator. Not shown on the index. */
  tags?: string[]
  /** Independent work, or a contribution to someone else's project. */
  kind: 'independent' | 'professional'
  /** Opening paragraph of the project page. */
  overview?: string
  /** What the project is, for work authored by others. */
  role?: string
  /** Only what Katarina did. */
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
    tags: ['AI', 'Participation', 'Physical–Digital'],
    kind: 'independent',
    overview:
      'FLAT explores how direct experience changes as it moves through perception, language and digital media.',
    sections: [
      {
        title: 'The installation',
        content: [
          'At the centre of the installation is a painting, The Burden of a Conscious Mind — 80 × 80 cm, oil and gesso on canvas. Its surface is heavily material, close to relief, built through layers, texture and surface depth that carry the traces of a long physical process.',
          'Nine screens are positioned beside it.',
        ],
      },
      {
        title: 'Interaction',
        steps: [
          'A visitor observes the physical painting.',
          'Using a phone, they describe what they see.',
          'The generative model receives only that description — it never sees the painting.',
          'The language is used to generate a new visual interpretation.',
          'The interpretation appears digitally within the installation.',
        ],
      },
      {
        title: 'System',
        content: [
          'The installation connects physical and digital space through several interaction elements:',
        ],
        items: ['Phone interaction', 'NFC', 'QR', 'Kiosk-style interfaces', 'Multiple screens'],
      },
      {
        title: 'Translation',
        highlight: 'physical object → perception → language → digital data → digital image',
        content: [
          'At each transition something is transferred, something changes, and something disappears.',
          'Experience becomes description. Description becomes information. Information becomes another image.',
        ],
      },
      {
        title: 'Attention',
        content: [
          'The process appears to digitally flatten the physical artwork. It also produces the opposite effect. To describe the painting properly, a visitor has to slow down and pay closer attention to texture, surface, light, colour, detail and depth.',
          'The digital system redirects attention back toward the qualities it cannot fully transmit: materiality, depth, time, presence.',
        ],
      },
    ],
    media: [],
  },
  {
    slug: 'shrinkme',
    title: 'ShrinkMe',
    type: 'AR · AI · Voice Interaction',
    kind: 'independent',
    overview:
      'ShrinkMe is an experimental AR prototype, made quickly as an exploration of conversational characters placed into physical space.',
    sections: [
      {
        title: 'The prototype',
        content: [
          'Virtual therapist characters are placed into the user’s surroundings, spoken to, and answer with generated dialogue that is voiced and animated.',
        ],
        items: [
          'AR',
          'Virtual therapist characters',
          'Voice input and speech interaction',
          'AI-generated dialogue',
          'Text-to-speech responses',
          'Character animation',
        ],
      },
      {
        title: 'Scope',
        content: [
          'This is a prototype and an experiment. It is not a finished therapy platform, it has not been clinically validated, and it is not a medical product.',
        ],
      },
    ],
    media: [],
  },
  {
    slug: 'the-book-of-distance',
    title: 'The Book of Distance',
    type: 'Narrative VR Experience',
    kind: 'professional',
    overview: 'The Book of Distance is a narrative VR work.',
    role: 'The work was created and directed by others. Katarina joined during the final production phase.',
    contribution: [
      'Optimization',
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
    kind: 'professional',
    overview:
      'A live mobile title, built and maintained by a team under a continuous release cycle. It is here for the realtime systems depth rather than the game itself.',
    role: 'Katarina worked as part of the development team.',
    contribution: [
      'Live gameplay features',
      'LiveOps',
      'Weekly releases',
      'Work across a large production codebase',
      'Architecture decisions',
      'Stability',
      'Internal tools',
      'Workflow optimization',
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

/**
 * Smaller studies, lighter in weight than the project index by design. New
 * entries only need appending here — the section reads straight from this list.
 */
export const experiments: Experiment[] = [
  {
    title: 'Proto',
    type: 'Systems / Architecture Study',
    note: 'A small Unity demo exploring scalable architecture with Zenject, MVC and unit testing. Also used in a teaching context.',
  },
  {
    title: 'Thomas Was Alone — Remake',
    type: 'Early Gameplay Experiment · 2016',
    note: 'A first Unity project, kept as personal history rather than current work.',
  },
  {
    // Working title. The recognition method is deliberately unstated: it has not
    // been confirmed, and naming one would be a guess.
    title: 'Painting AR Experiment',
    type: 'Physical painting / mobile interaction / animation · 2020',
    note: 'A physical painting recognised through a phone, with digital animation connected to the work. An early version of the physical–digital direction that FLAT continues.',
  },
]
