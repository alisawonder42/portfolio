export interface CvExperience {
  company: string
  role: string
  start: string
  end: string
  employmentType: string
  workMode?: string
  location?: string
  description: string[]
}

export interface CvEducation {
  title: string
  school: string
  faculty: string
  dates: string
}

export const cvContent = {
  name: 'Katarina Ranković',
  headline: 'Creative Technologist / Software Engineer',
  profile: [
    'Creative technologist and software engineer with 8+ years of professional experience building games and realtime interactive systems, primarily with Unity and C#.',
    'Background across gameplay systems, UI and animation, system architecture and development tools, with additional experience in VR, Unreal Engine/C++, web-based realtime systems and AI-assisted development.',
  ],
  experience: [
    {
      company: 'Nurture',
      role: 'Senior AI Unity Platform Engineer',
      start: 'FEB 2026',
      end: 'MAY 2026',
      employmentType: 'Freelance',
      description: [
        'Worked on a Unity-based educational platform for children and its transition toward a web-based realtime platform.',
        'Contributed to gameplay and interactive systems, engine-level architecture and the migration of Unity systems toward a Babylon.js-based web implementation. Used coding agents and AI-assisted development workflows as part of implementation, debugging and iteration.',
      ],
    },
    {
      company: 'LingoLooper',
      role: 'Full Stack Developer',
      start: 'AUG 2025',
      end: 'FEB 2026',
      employmentType: 'Freelance',
      description: [
        'Worked across .NET backend services and a Unity client in a small startup environment.',
        'Built REST integrations, set up Jenkins CI/CD pipelines and unit testing, and worked closely with the CTO on technical setup, architecture and engineering workflows.',
      ],
    },
    {
      company: 'Tactile Games',
      role: 'Game Programmer',
      start: 'FEB 2023',
      end: 'MAY 2025',
      employmentType: 'Full-time',
      workMode: 'On-site',
      location: 'Copenhagen, Denmark',
      description: [
        'Worked on Lily’s Garden, a large live Unity match-3 game, developing gameplay features, UI and animation using Unity Animator and Timeline.',
        'Worked closely with artists and designers to implement visual and interactive features, while contributing to architecture, unit testing, internal tools and maintainable development inside a large production codebase.',
      ],
    },
    {
      company: 'Ironbelly Studios',
      role: 'Senior Unity Developer',
      start: 'JAN 2022',
      end: 'JAN 2023',
      employmentType: 'Freelance',
      workMode: 'Remote',
      description: [
        'Worked on Unity and VR projects including The Book of Distance, focusing on performance optimization, bug fixing and testing during the final stage of development.',
        'Also worked with Unreal Engine and C++ on an early prototype.',
      ],
    },
    {
      company: 'Yboga',
      role: 'Unity Developer',
      start: 'NOV 2020',
      end: 'JAN 2022',
      employmentType: 'Full-time',
      workMode: 'Hybrid',
      location: 'Belgrade, Serbia',
      description: [
        'Worked on My Dream Hotel Story, contributing to a Unity project developed from the ground up.',
        'Focused particularly on gameplay systems and game AI for the small autonomous characters moving through and interacting with the game world, alongside architecture and development tools.',
      ],
    },
    {
      company: 'Brave Giant',
      role: 'Unity Team Lead',
      start: 'OCT 2019',
      end: 'NOV 2020',
      employmentType: 'Full-time',
      workMode: 'On-site',
      location: 'Novi Sad, Serbia',
      description: [
        'Led a small team of Unity developers (about 1–3 people) while remaining hands-on with development.',
        'Worked on project architecture, technical setup, code reviews and day-to-day technical guidance, collaborating closely with artists and designers across Nora’s Adventures and several HOPA titles.',
      ],
    },
    {
      company: 'IGT',
      role: 'Software Engineer I',
      start: 'MAR 2018',
      end: 'JUN 2019',
      employmentType: 'Full-time',
      workMode: 'On-site',
      location: 'Belgrade, Serbia',
      description: [
        'Developed Unity/C# casino games for regulated markets, working across gameplay, UI and animation within established production and compliance requirements.',
      ],
    },
  ] satisfies CvExperience[],
  education: [
    {
      title: 'BSc Computer Science',
      school: 'University of Novi Sad',
      faculty: 'Faculty of Sciences',
      dates: 'Completed 2021',
    },
    {
      title: 'Previous Computer Science studies',
      school: 'University of Belgrade',
      faculty: 'Faculty of Mathematics',
      dates: '2013 — 2016',
    },
  ] satisfies CvEducation[],
  capabilities: [
    { title: 'Realtime', items: ['Unity', 'Unreal Engine'] },
    { title: 'Code', items: ['C#', 'C++', '.NET'] },
    {
      title: 'Interactive systems',
      items: [
        'Gameplay Systems',
        'UI Implementation',
        'Animation',
        'Unity Animator',
        'Timeline',
        'AR / VR',
        'Realtime Interaction',
      ],
    },
    {
      title: 'Engineering',
      items: [
        'System Architecture',
        'Clean Architecture',
        'Unit Testing',
        'Development Tools',
        'Performance Profiling',
        'CI/CD',
      ],
    },
    {
      title: 'Workflow / tooling',
      items: ['Git', 'Jenkins', 'AI-assisted Development'],
    },
  ],
  languages: [
    { name: 'Serbian', level: 'Native' },
    { name: 'English', level: 'Fluent' },
    { name: 'Danish', level: 'A2' },
  ],
} as const
