import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
  VerticalAlign,
  HeightRule,
} from 'docx';

// A4 in twips (1/20 pt): 210mm x 297mm at 1440 twips/inch.
const A4_WIDTH = 11906;
const A4_HEIGHT = 16838;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');
const photoPath = path.join(rootDir, 'public', 'assets', 'george.jpg');

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

// Dark espresso-brown sidebar (matched to the user's VS Code theme swatch)
// with a warm gold accent, against a warm ivory main column.
const INK = '181818';
const SUMMARY_GRAY = '3A3A3A';
const META_GRAY = '5C5C5C';
const BODY_GRAY = '2B2B2B';
const MAIN_BG = 'F7F3EC';
const SIDEBAR_BG = '362B1E';
const SIDEBAR_TEXT = 'EDE6DA';
const SIDEBAR_MUTED = 'AD9A85';
const ACCENT = 'B08D57';

// Georgia + Garamond: a refined serif pairing that ships with Word/Office on
// both Windows and macOS and is mapped consistently by LibreOffice/Google
// Docs, so it renders the same everywhere instead of silently falling back
// to a generic substitute the way a Windows-only font can.
const HEADING_FONT = 'Georgia';
const BODY_FONT = 'Garamond';

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function cell({ children, width, shading, verticalAlign, margins }) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: noBorders,
    shading,
    verticalAlign: verticalAlign ?? VerticalAlign.TOP,
    margins: margins ?? { top: 0, bottom: 0, left: 0, right: 0 },
    children,
  });
}

function sidebarLabel(text) {
  return new Paragraph({
    spacing: { before: 420, after: 180 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: SIDEBAR_MUTED, space: 5 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 20,
        color: 'FFFFFF',
        font: HEADING_FONT,
        characterSpacing: 18,
      }),
    ],
  });
}

function mainLabel(text) {
  return new Paragraph({
    spacing: { before: 420, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 5 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 23,
        color: SIDEBAR_BG,
        font: HEADING_FONT,
        characterSpacing: 16,
      }),
    ],
  });
}

// Custom colored dot bullets (instead of Word's default black ones), with a
// hanging indent so wrapped lines line up under the text rather than the dot.
function bulletParagraph(text, { dot, textColor, size = 20 } = {}) {
  return new Paragraph({
    spacing: { after: 90, line: 300 },
    indent: { left: 240, hanging: 240 },
    children: [
      new TextRun({ text: '●  ', color: dot, size: 13, font: BODY_FONT }),
      new TextRun({ text, size, color: textColor, font: BODY_FONT }),
    ],
  });
}

const photoBuffer = readFileSync(photoPath);

// --- Sidebar: photo, title, contact list, education, skills, languages ---

const sidebarChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 140 },
    children: [
      new ImageRun({
        data: photoBuffer,
        type: 'jpg',
        transformation: { width: 160, height: 160 },
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [
      new TextRun({
        text: profile.jobTitle.toUpperCase(),
        bold: true,
        size: 20,
        color: SIDEBAR_MUTED,
        font: HEADING_FONT,
        characterSpacing: 10,
      }),
    ],
  }),

  sidebarLabel('Contact'),
  ...profile.contact.map(
    (text) =>
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text, size: 21, color: SIDEBAR_TEXT, font: BODY_FONT })],
      }),
  ),

  sidebarLabel('Education'),
  new Paragraph({
    spacing: { after: 50 },
    children: [
      new TextRun({
        text: profile.education.degree,
        bold: true,
        size: 20,
        color: 'FFFFFF',
        font: HEADING_FONT,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 50 },
    children: [
      new TextRun({ text: profile.education.school, size: 19, color: SIDEBAR_MUTED, font: BODY_FONT }),
    ],
  }),
  new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text: profile.education.dates,
        italics: true,
        size: 19,
        color: SIDEBAR_MUTED,
        font: BODY_FONT,
      }),
    ],
  }),

  sidebarLabel('Skills'),
  ...profile.skills.map((skill) =>
    bulletParagraph(skill, { dot: SIDEBAR_MUTED, textColor: SIDEBAR_TEXT, size: 21 }),
  ),

  sidebarLabel('Languages'),
  ...profile.languages.map(
    (lang) =>
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: lang.name, size: 21, color: SIDEBAR_TEXT, font: BODY_FONT }),
          new TextRun({
            text: `  ${lang.level}`,
            italics: true,
            size: 19,
            color: SIDEBAR_MUTED,
            font: BODY_FONT,
          }),
        ],
      }),
  ),
];

// --- Main column: name, summary, work experience ---

const mainChildren = [
  new Paragraph({
    spacing: { after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 14, color: ACCENT, space: 14 } },
    children: [
      new TextRun({
        text: profile.name.toUpperCase(),
        bold: true,
        size: 58,
        color: SIDEBAR_BG,
        font: HEADING_FONT,
        characterSpacing: 6,
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 140, line: 330 },
    children: [
      new TextRun({ text: profile.summary, size: 24, color: SUMMARY_GRAY, font: BODY_FONT }),
    ],
  }),

  mainLabel('Work Experience'),
  ...profile.experience.flatMap((job) => [
    new Paragraph({
      spacing: { before: 280, after: 30 },
      children: [
        new TextRun({ text: job.role, bold: true, size: 25, color: INK, font: HEADING_FONT }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `${job.company}  ·  ${job.dates}`,
          italics: true,
          size: 20,
          color: META_GRAY,
          font: BODY_FONT,
        }),
      ],
    }),
    ...job.bullets.map((bullet) =>
      bulletParagraph(bullet, { dot: ACCENT, textColor: BODY_GRAY, size: 22 }),
    ),
  ]),
];

// --- Page: one table, one row — sidebar and main column side by side ---

const pageTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: noBorders,
  rows: [
    new TableRow({
      // Forces the row to at least fill one A4 page, so both column
      // backgrounds reach the bottom edge even when their content is
      // shorter than a full page — no more blank unfilled page below.
      height: { value: A4_HEIGHT, rule: HeightRule.ATLEAST },
      children: [
        cell({
          width: 33,
          shading: { type: ShadingType.CLEAR, color: 'auto', fill: SIDEBAR_BG },
          margins: { top: 560, bottom: 560, left: 340, right: 340 },
          children: sidebarChildren,
        }),
        cell({
          width: 67,
          shading: { type: ShadingType.CLEAR, color: 'auto', fill: MAIN_BG },
          margins: { top: 560, bottom: 560, left: 460, right: 420 },
          children: mainChildren,
        }),
      ],
    }),
  ],
});

const doc = new Document({
  background: { color: MAIN_BG },
  styles: {
    default: {
      document: { run: { font: BODY_FONT, size: 22, color: INK } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: A4_WIDTH, height: A4_HEIGHT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [pageTable],
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
