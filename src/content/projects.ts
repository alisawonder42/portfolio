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
    title: 'un:seen — Interactive Installation',
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
      'A text-driven generative installation linking a mobile web interface, an image-generation workflow, Supabase storage and an Android kiosk across nine tablets. The model receives visitors’ descriptions, never the source painting.',
    sections: [
      {
        title: 'Verbalization as an interface',
        content: [
          'When visitors put their perception into words, they make a subjective, momentary reading of the painting explicit. That act of verbalization is central: language becomes the interface between looking and machine interpretation. The generator works only from those descriptions, so each image reflects what a person noticed and chose to express rather than a direct transformation of the painting.',
        ],
      },
      {
        title: 'Technical system',
        content: [
          'I built a mobile web interface to collect descriptions and connect them to an image-generation workflow. Supabase (PostgreSQL, Auth and Storage) stores descriptions, timestamps and generated image assets. An Android kiosk app distributes the resulting images across nine tablets; retry and fallback handling keeps the installation usable when generation or network requests fail.',
        ],
      },
      {
        title: 'An exploratory view of creativity',
        content: [
          'I approach creativity as forward-looking exploration: a way to test what new relationships between perception, language and generative systems might make possible. un:seen asks how people and computational tools could create new routes for making and experiencing images. The references below frame the questions I am exploring rather than offering a settled answer.',
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
        label: 'Installation video · Serbian · MP4',
        href: '/projects/unseen/unseen-instagram-sr.mp4',
      },
      {
        label: 'Inspiration: There’s no such thing as AI art · IAI',
        href: 'https://iai.tv/articles/theres-no-such-thing-as-ai-art-auid-3621',
      },
      {
        label: 'Related research: How AI and Human Behaviors Shape Psychosocial Effects of Extended Chatbot Use · MIT Media Lab',
        href: 'https://www.media.mit.edu/publications/how-ai-and-human-behaviors-shape-psychosocial-effects-of-chatbot-use-a-longitudinal-controlled-study/',
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
    overview:
      'The story follows Yonezo Okita, who left Hiroshima for Canada in 1935 but later faced racism and forced internment during World War II. His grandson, artist Randall Okita, retraces his life in an interactive story about family, displacement and memory.',
    contribution: [
      'I supported the team with testing and performance profiling during the final stage of the project.',
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
  year: string
  type: string
  note?: string
  link?: string
  image?: string
  imageAlt?: string
}

/**
 * Smaller studies, lighter in weight than the project index by design. New
 * entries only need appending here — the section reads straight from this list.
 */
export const experiments: Experiment[] = [
  {
    title: 'game:copycat',
    year: '2016',
    link: 'https://www.katarinagames.fyi/platformer-study.html',
    type: 'Early Gameplay Experiment',
    note: 'My first Unity/C# project: a platformer prototype exploring gameplay mechanics, post-processing and VFX.',
  },

  {
    title: 'cat:test:ar',
    year: '2017',
    type: 'Unity AR experiment',
    note: 'The first time I used Unity to play with augmented reality.',
    link: 'https://photos.google.com/share/AF1QipPcSl4JC-aBn2ba2kgFgENxaKoezdfPbXdP7TxlTNbREOoYL_3Iunr4CKfHEolgkQ/photo/AF1QipPrQ_6ATnbMG2JFGY2RY2lzfb-Tq1APMdaAux1K?key=dmZ3N1BPZlZ1ajBfRnR2ZUg5VzRQbXI0YnhlS0FB',
  },
  {
    title: 'computer:graphics:opengl',
    year: '2016',
    type: 'C++ / OpenGL study',
    note: 'A DX-Ball-style clone and my first C++/OpenGL project, made during university computer graphics coursework.',
    link: 'https://youtube.com/shorts/2V-GeYQu81c',
  },
]
