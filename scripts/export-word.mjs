import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');

// Mirrors src/app/profiles/frontend.profile.ts + shared-contact.const.ts.
// Kept as plain data here (rather than importing the TS profile) so this script
// has no build step and no Angular/TS dependency — edit this file directly,
// or re-sync it by hand if the source profile changes.
const profile = {
  name: 'Georgios Vasilakis',
  jobTitle: 'Frontend Developer',
  contact: [
    '+30 694 442 8973',
    'g979design@gmail.com',
    'Athens, Greece',
    'github.com/G979',
    'linkedin.com/in/george-vasilakis',
    'facebook.com/george.vasilakis1',
  ],
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
  education: {
    degree: 'B.Eng. Electrical & Computer Engineering',
    school: 'Technical University of Crete',
    dates: 'Thesis: "Blockchain smart contract system for secure health data sharing"',
  },
};

const ACCENT = '2563EB';
const DARK = '1F2937';
const GRAY = '6B7280';

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 },
    },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: ACCENT, size: 22 })],
  });
}

const experienceBlocks = profile.experience.flatMap((job) => [
  new Paragraph({
    spacing: { before: 200, after: 20 },
    children: [
      new TextRun({ text: job.role, bold: true, size: 22, color: DARK }),
      new TextRun({ text: `  —  ${job.company}`, size: 22, color: DARK }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: job.dates, italics: true, size: 20, color: GRAY })],
  }),
  ...job.bullets.map(
    (bullet) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40 },
        children: [new TextRun({ text: bullet, size: 21 })],
      }),
  ),
]);

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 21, color: DARK },
      },
    },
  },
  sections: [
    {
      properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      children: [
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: profile.name, bold: true, size: 40, color: DARK })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: profile.jobTitle, size: 26, color: ACCENT, bold: true })],
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: profile.contact.join('   |   '), size: 19, color: GRAY })],
        }),

        sectionHeading('Summary'),
        new Paragraph({
          spacing: { after: 80 },
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: profile.summary, size: 21 })],
        }),

        sectionHeading('Experience'),
        ...experienceBlocks,

        sectionHeading('Skills'),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: profile.skills.join('   •   '), size: 21 })],
        }),

        sectionHeading('Languages'),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: profile.languages.map((l) => `${l.name} (${l.level})`).join('   |   '),
              size: 21,
            }),
          ],
        }),

        sectionHeading('Education'),
        new Paragraph({
          spacing: { after: 20 },
          children: [new TextRun({ text: profile.education.degree, bold: true, size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 20 },
          children: [new TextRun({ text: profile.education.school, size: 21 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: profile.education.dates, italics: true, size: 19, color: GRAY })],
        }),
      ],
    },
  ],
});

async function main() {
  if (!existsSync(exportsDir)) {
    mkdirSync(exportsDir, { recursive: true });
  }
  const outPath = path.join(exportsDir, 'georgios-vasilakis-cv.docx');
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(outPath, buffer);
  console.log(`Saved ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
