import { CvProfile } from './cv-profile.model';
import { baseIdentity } from './shared-contact.const';

export const generalProfile: CvProfile = {
  ...baseIdentity,
  id: 'general',
  jobTitle: 'Software Engineer',
  summary:
    "Software engineer based in Athens with an Electrical & Computer Engineering background. Over six years I've built B2B transaction platforms, real-time logistics tracking systems, and Ethereum smart contracts — aiming for the sweet spot between technical precision and genuinely enjoyable UX. Delivered 10+ freelance projects end-to-end and mentored junior developers along the way.",
  experience: [
    {
      role: 'Software Engineer',
      company: 'Digital Academy',
      dates: 'Oct 2023 – Present',
      bullets: [
        'Led development of a transfer platform processing 2,000+ monthly B2B transactions',
        'Built and maintained Angular/PHP Laravel applications used by 100+ companies',
        'Improved client experience across 4 pre-existing applications',
      ],
    },
    {
      role: 'Front-End Developer',
      company: 'Elta Courier',
      dates: 'Jul 2021 – Jul 2023',
      bullets: [
        'Built a React + Python Flask logistics tracking platform for company-wide use',
        'Integrated 5+ third-party APIs for payments, mapping, and notifications',
        'Built standalone Angular microservices for internal operations',
      ],
    },
    {
      role: 'Freelance Software Engineer',
      company: 'Self-Employed',
      dates: 'Jan 2020 – Present',
      bullets: [
        'Delivered 10+ full-stack client projects end-to-end with a 100% satisfaction rating',
        'Built Angular/React frontends on PHP Laravel backends, from REST API design to deployment',
        'Provided ongoing technical consultation and support across the full development lifecycle',
      ],
    },
  ],
  skills: [
    'Angular',
    'React',
    'TypeScript',
    'JavaScript',
    'CSS/SCSS',
    'PHP Laravel',
    'REST APIs',
    'Git & GitHub',
    'Docker',
  ],
  languages: [
    { name: 'Greek', level: 'Native' },
    { name: 'English', level: 'Fluent (C2)' },
    { name: 'German', level: 'Intermediate (B2)' },
  ],
};
