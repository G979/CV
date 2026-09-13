import { CvProfile } from './cv-profile.model';
import { baseIdentity } from './shared-contact.const';

export const frontendProfile: CvProfile = {
  ...baseIdentity,
  id: 'frontend',
  jobTitle: 'Frontend Developer',
  summary:
    'Frontend-focused software engineer based in Athens with 5+ years building responsive Angular and React applications. I care about clean component architecture, smooth UX, and getting pixel-perfect designs into production fast — with a full-stack Laravel/Node background to back it up when the API needs shaping too.',
  experience: [
    {
      role: 'Software Engineer',
      company: 'Digital Academy',
      dates: 'Oct 2023 – Present',
      bullets: [
        'Built responsive Angular and React applications for 100+ companies, improving UX across 4 legacy apps',
        'Mentored junior developers through a full frontend training program',
        'Led development of a transfer platform processing 2,000+ monthly B2B transactions',
      ],
    },
    {
      role: 'Front-End Developer',
      company: 'Elta Courier',
      dates: 'Jul 2021 – Jul 2023',
      bullets: [
        'Developed a React-based logistics tracking UI backed by a Python Flask API',
        'Built standalone Angular microservices and marketing landing pages',
        'Integrated 5+ third-party APIs for payments, mapping, and notifications',
      ],
    },
    {
      role: 'Freelance Software Engineer',
      company: 'Self-Employed',
      dates: 'Jan 2020 – Present',
      bullets: [
        'Built Angular/React frontends for 10+ client projects with a 100% satisfaction rating',
        'Designed and shipped progressive web apps that increased user engagement',
        'Built full-stack web applications end-to-end, from Angular/React frontends to PHP Laravel backends',
      ],
    },
  ],
  skills: [
    'Angular',
    'React',
    'TypeScript',
    'JavaScript',
    'CSS/SCSS',
    'RxJS',
    'Material Design',
    'Figma',
    'Git & GitHub',
  ],
  languages: [
    { name: 'Greek', level: 'Native' },
    { name: 'English', level: 'Fluent (C2)' },
    { name: 'German', level: 'Intermediate (B2)' },
  ],
};
