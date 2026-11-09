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
  title?: string
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
  /** If set, the image or video opens this URL in a new tab. */
  href?: string
}

export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectEmbed {
  src: string
  title: string
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
  /** Shown as Role on the project page, e.g. Freelance Unity Developer. */
  credit?: string
  /** Shown as Location on the project page. */
  location?: string
  /** Shown as Project type when it differs from the homepage `type` line. */
  kindLabel?: string
  /** Credit line under the spec, e.g. a collaboration. */
  collaboration?: string
  collaborationLink?: ProjectLink
  /** Only what Katarina did. */
  contribution?: string[]
  sections?: ProjectSection[]
  /** Documentation lives on the project page, never on the homepage. */
  media?: ProjectMedia[]
  externalLinks?: ProjectLink[]
  embed?: ProjectEmbed
}

export const projects: Project[] = [
  {
    slug: 'unseen',
    title: 'un:seen',
    year: '2026',
    type: 'Interactive Installation / Generative AI',
    kindLabel: 'Interactive Installation / Generative AI',
    credit: 'Concept & technical development',
    kind: 'independent',
    collaboration: 'In collaboration with painter Mladen Ilić —',
    collaborationLink: {
      label: 'View his paintings ↗',
      href: 'https://mladenilic.art/',
    },
    overview:
      'un:seen demonstrates how AI and interactive technology can turn audience input into a shared experience, connecting a physical painting, a mobile interface and nine screens.',
    sections: [
      {
        title: 'The concept',
        content: [
          'I developed the concept for un:seen from Mladen Ilić’s metaphysical paintings and his intuitive approach to painting. His work and creative process were the starting point for the installation.',
        ],
      },
      {
        title: 'The experience',
        content: [
          'Visitors describe a painting on their phones. Their words become AI-generated images displayed across a three-by-three grid of tablets beside the original work. The model never sees the painting: each result starts with a visitor’s description.',
        ],
      },
      {
        title: 'My contribution',
        content: [
          'I developed the interactive system, from the mobile interface and image-generation workflow to the Android kiosk app that displays the results. I also designed the exhibition catalogue. The project combines my interest in installations with practical experimentation in AI, interaction and physical space.',
        ],
      },
      {
        title: 'Technical setup',
        content: [
          'The system connects the OpenAI Image API with Supabase for image storage and data, and uses Capacitor for the Android kiosk app. Retry and fallback handling help keep the experience running during public use.',
        ],
      },
      {
        title: 'Exhibition',
        content: [
          'The exhibition presents un:seen as a working demonstration of audience participation and generative technology in a shared physical space.',
        ],
      },
    ],
    media: [
      {
        kind: 'image',
        src: '/projects/unseen/installation.gif',
        alt: 'un:seen installation mockup: a painting beside a three-by-three grid of portrait tablets.',
        caption: 'Installation mockup showing the painting and nine-screen display.',
      },
    ],
    externalLinks: [
      {
        label: 'Katalog · srpski · PDF (A5)',
        href: '/projects/unseen/unseen-katalog-A5.pdf',
      },
      {
        label: 'Katalog za štampu · srpski · PDF (A4)',
        href: '/projects/unseen/unseen-katalog-A4-stampa.pdf',
      },
      {
        label: 'Instagram video · srpski · MP4',
        href: '/projects/unseen/unseen-instagram-sr.mp4',
      },
    ],
  },
  {
    slug: 'box',
    title: 'box : distortion: in progress',
    year: '2026',
    type: 'Interactive 3D / Photogrammetry',
    kindLabel: 'Interactive 3D / Photogrammetry',
    kind: 'independent',
    sections: [
      {
        title: 'Concept: digital distortion',
        content: [
          'I wanted to explore the contrast between a realistic, physical-looking object and an unmistakably digital effect. Rather than a retro ASCII look, I was interested in subtle distortions that reveal the object’s digital nature.',
        ],
      },
      {
        title: 'Photogrammetry',
        content: [
          'I photographed a real ornamental box from multiple angles with a camera and used photogrammetry to reconstruct it as a 3D object.',
        ],
      },
      {
        title: 'Technical side',
        content: [
          'I brought the scanned model into an interactive web scene. A cursor-following square reveals scanlines, RGB separation and distortion on the box’s surface, with normal-map information helping the effect respond to its shape. Still a work in progress.',
        ],
      },
    ],
    embed: {
      src: 'https://alisawonder42.github.io/boxpreview/?embed=1',
      title: 'The box',
    },
    media: [
      {
        kind: 'image',
        src: '/projects/box/desk.jpg',
        alt: 'The physical ornamental box beside a monitor displaying its photogrammetry-based 3D model.',
      },
    ],
  },
  {
    slug: 'the-book-of-distance',
    title: 'the book of distance:vr',
    year: '2022',
    type: 'Narrative VR experience',
    kindLabel: 'Virtual Reality',
    credit: 'Consultant',
    kind: 'professional',
    role: 'A narrative VR experience by Randall Okita, produced by the National Film Board of Canada.',
    contribution: [
      'I supported the team during the final stage of development, mainly through testing and performance profiling, with a small contribution to development.',
    ],
    media: [
      {
        kind: 'image',
        src: '/projects/the-book-of-distance/poster.jpg',
        alt: 'Promotional poster for The Book of Distance: a silhouetted figure on a ship looking out over a moonlit sea.',
        href: 'https://www.meta.com/experiences/pcvr/the-book-of-distance/3726132664124874/',
      },
      {
        kind: 'image',
        src: '/projects/the-book-of-distance/still.png',
        alt: 'Still from The Book of Distance: a figure stands in a shadowed room looking out through a circular opening into a garden.',
        href: 'https://www.meta.com/experiences/pcvr/the-book-of-distance/3726132664124874/',
      },
    ],
  },
  {
    slug: 'mladen-ilic',
    title: 'artist portfolio:web',
    year: '2026',
    type: 'Artist Portfolio / Photography / Video',
    kindLabel: 'Artist Portfolio',
    credit: 'Concept, photography & video',
    kind: 'professional',
    overview:
      'A website for painter Mladen Ilić, bringing his work into a digital space through photography, video and a personal visual identity.',
    contribution: [
      'I developed the concept for the website, took the photographs and filmed the videos used to present his work.',
    ],
    sections: [
      {
        title: 'A signature as an identity',
        content: [
          'In place of a typeset name, I used his handwritten signature as the website’s identifying mark. It echoes the way an artist signs a painting, carrying that sense of authorship and authenticity into the digital space.',
        ],
      },
    ],
    externalLinks: [
      { label: 'Visit mladenilic.art', href: 'https://mladenilic.art/' },
    ],
  },
  {
    slug: 'soft-photography',
    title: 'soft:photography',
    type: 'Analogue Photography / Digital Experiments',
    kindLabel: 'Photography / Digital Experiments',
    kind: 'independent',
    year: '2017',
    overview:
      'An early experiment with analogue photography and digital forms, photographed on a Zenit film camera in 2017.',
    media: [
      {
        kind: 'image',
        src: '/projects/soft-photography/soft_photography_original_photos.gif',
        alt: 'A simple looping slideshow of five original Zenit photographs of women.',
        caption: 'Five photographs, shown in sequence without effects.',
      },
    ],
    sections: [
      {
        title: 'Explorations',
        content: [
          'A series of photographs of sisters and friends in everyday moments, made while trying to capture something of girlhood.',
        ],
      },
    ],
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
  link?: string
}

/**
 * Smaller studies, lighter in weight than the project index by design. New
 * entries only need appending here — the section reads straight from this list.
 */
export const experiments: Experiment[] = [
  {
    title: 'thomas was alone:copycat',
    link: 'https://www.katarinagames.fyi/thomas-was-alone',
    type: 'Early Gameplay Experiment · 2016',
    note: 'A first Unity project, kept as personal history rather than current work.',
  },
  {
    title: 'painting:ar',
    type: 'Physical painting / mobile interaction / animation · 2020',
    note: 'I was experimenting with an app that recognised a picture when you pointed your phone at it and brought it to life with animation. Unfortunately, I no longer have access to the project files.',
  },
]
