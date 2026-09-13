import { CvProfile } from './cv-profile.model';
import { baseIdentity } from './shared-contact.const';

export const blockchainProfile: CvProfile = {
  ...baseIdentity,
  id: 'blockchain',
  jobTitle: 'Blockchain Engineer',
  summary:
    "Software engineer based in Athens specializing in blockchain and full-stack web development. My thesis built an Ethereum smart contract system for secure health data sharing, and I've since applied that same rigor to production fintech platforms — combining Solidity/Web3 experience with 6 years of Angular/React/Node engineering.",
  experience: [
    {
      role: 'Software Engineer',
      company: 'Digital Academy',
      dates: 'Oct 2023 – Present',
      bullets: [
        'Led development of a transfer platform processing 2,000+ monthly B2B transactions',
        'Built secure, production Angular/PHP Laravel applications for 100+ companies',
        'Improved client experience across 4 pre-existing applications',
      ],
    },
    {
      role: 'Freelance Software Engineer',
      company: 'Self-Employed',
      dates: 'Jan 2020 – Present',
      bullets: [
        'Delivered 10+ full-stack client projects end-to-end with a 100% satisfaction rating',
        'Built full-stack web apps end-to-end, from Angular/React frontends to PHP Laravel backends',
        'Designed REST APIs and built progressive web apps that increased user engagement',
      ],
    },
    {
      role: 'Front-End Developer',
      company: 'Elta Courier',
      dates: 'Jul 2021 – Jul 2023',
      bullets: [
        'Built a React + Python Flask logistics tracking platform integrating 5+ third-party APIs',
        'Built standalone Angular microservices for internal operations',
        'Built HTML/CSS/JavaScript landing pages for marketing campaigns',
      ],
    },
  ],
  skills: [
    'Solidity',
    'Ethereum',
    'Web3.js',
    'Smart Contracts',
    'TypeScript',
    'React',
    'Node.js',
    'REST APIs',
    'Git & GitHub',
  ],
  languages: [
    { name: 'Greek', level: 'Native' },
    { name: 'English', level: 'Fluent (C2)' },
    { name: 'German', level: 'Intermediate (B2)' },
  ],
};
