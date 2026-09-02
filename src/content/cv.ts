/**
 * CV page content. Drawn from existing site copy and project pages.
 * Empty hrefs are omitted at render so the page never links nowhere.
 *
 * Fill `siteContent.contact.linkedin` and `siteContent.contact.email` in
 * `site.ts` when those destinations exist. There is no PDF in the repo.
 */

export interface CvExperience {
  title: string
  role: string
  place?: string
  summary: string[]
}

export const cvContent = {
  eyebrow: '01',
  title: 'CV',
  name: 'Katarina Ranković',
  headline: 'Creative Technologist / Software Engineer',
  profile: [
    'Katarina Ranković is a creative technologist and software engineer with a BSc in Computer Science and 8+ years of professional experience building games and realtime interactive systems, primarily with Unity and C#.',
    'Her work combines a strong engineering background with interactive systems, realtime technology, generative AI and physical–digital experiences.',
  ],
  experience: [
    {
      title: "Lily's Garden",
      role: 'Gameplay Developer',
      place: 'Tactile · Copenhagen, Denmark',
      summary: [
        'Part of a large live Unity project, with a strong focus on UI, animation and feature development.',
        'Built and integrated animated UI and interactive sequences using Unity’s Animator and Timeline, working closely with artists and designers.',
        'Worked in a large existing codebase where architecture, maintainability and unit testing mattered, and contributed to internal tools and workflow improvements.',
      ],
    },
    {
      title: 'The Book of Distance',
      role: 'Freelance Unity Developer',
      summary: [
        'Joined during the final stage of development, mainly on performance optimization, bug fixing and testing.',
        'Profiling, gameplay and interaction fixes, testing across target VR devices, and stability work ahead of launch on SteamVR and Oculus.',
      ],
    },
  ] satisfies CvExperience[],
  education: [{ title: 'BSc Computer Science' }],
  capabilities: [
    {
      title: 'Realtime',
      items: ['Unity / C#', 'Unreal / C++'],
    },
    {
      title: 'Systems',
      items: [
        'Realtime systems / gameplay systems',
        'System architecture / clean architecture',
        'Unit testing / development tools',
      ],
    },
    {
      title: 'Implementation',
      items: [
        'UI implementation / animation',
        'Unity Animator / Timeline',
        'Working closely with artists and designers',
      ],
    },
    {
      title: 'Creative technology',
      items: [
        'Interactive systems',
        'Generative AI in interactive experiences',
        'Physical–digital interaction',
      ],
    },
  ],
} as const
