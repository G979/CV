import { execFileSync } from 'node:child_process';
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
  LineRuleType,
} from 'docx';

// Usage:
//   npm run export:word                      -> exports/georgios-vasilakis-cv.docx (ocean)
//   npm run export:word -- --theme=espresso  -> the older dark-brown design
//   npm run export:word -- --pdf             -> also saves a PDF (needs Microsoft Word on Windows)

// A4 in twips (1/20 pt): 210mm x 297mm at 1440 twips/inch.
const A4_WIDTH = 11906;
const A4_HEIGHT = 16838;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const exportsDir = path.join(rootDir, 'exports');
const photoPath = path.join(rootDir, 'public', 'assets', 'george.jpg');

const args = process.argv.slice(2);
const themeName = (args.find((a) => a.startsWith('--theme=')) ?? '--theme=ocean').slice(8);
const wantPdf = args.includes('--pdf');

// Kept as plain data here (rather than importing the TS profile) so this script
// has no build step. It follows the LinkedIn profile wording, which is a little
// more detailed than the website version.
const profile = {
  name: { first: 'Georgios', last: 'Vasilakis' },
  jobTitle: 'Frontend Engineer',
  contact: [
    '+30 694 442 8973',
    'g979design@gmail.com',
    'Athens, Greece',
    'linkedin.com/in/george-vasilakis-dev',
    'github.com/G979',
    'g979.github.io/g979-updated-portfolio',
  ],
  summary:
    'Frontend engineer based in Athens with 5+ years of experience building responsive, user-friendly web applications in Angular, React and TypeScript. I focus on maintainable component architecture and fast, intuitive interfaces, from the first Figma mockup to the final release. Full-stack experience with Laravel, Node.js and Python, and a background in blockchain and smart contracts.',
  experience: [
    {
      role: 'Software Engineer',
      company: 'Digital Academy',
      dates: 'Oct 2023 – Oct 2026',
      bullets: [
        'Led development of a B2B transfer platform processing 10,000+ monthly transactions',
        'Built and maintained responsive Angular and React applications used by 100+ companies',
        'Modernized the UX of 4 legacy applications, improving usability and consistency',
        'Mentored junior developers through a full frontend training program',
      ],
    },
    {
      role: 'Front-End Developer',
      company: 'ELTA Courier',
      dates: 'Jul 2021 – Jul 2023',
      bullets: [
        'Developed a React-based logistics tracking UI backed by a Python Flask API',
        'Integrated 5+ third-party APIs for payments, mapping and notifications',
        'Built standalone Angular microservices for internal operations',
        'Created marketing landing pages with HTML, CSS and JavaScript',
      ],
    },
    {
      role: 'Freelance Software Engineer',
      company: 'Self-Employed',
      dates: 'Jan 2020 – Present',
      bullets: [
        'Delivered 10+ client projects end-to-end with a 100% client satisfaction rate',
        'Built full-stack web applications with Angular/React frontends and PHP Laravel backends',
        'Designed and shipped progressive web apps (PWAs) for mobile-first users',
        'Managed the full project lifecycle: requirements, design, development and deployment',
      ],
    },
    {
      role: 'Junior Frontend Developer',
      company: 'Nostos Software Solutions',
      dates: 'Sep 2018 – Nov 2019',
      bullets: [
        'Helped develop a modular ERP system in Angular, building CRUD features across its modules',
        'Built Angular applications and microservices for internal and client software',
        'Created and customized web pages with WordPress, HTML5 and CSS, following SEO best practices',
      ],
    },
  ],
  skillGroups: [
    { label: 'Frontend', items: 'Angular, React, TypeScript, JavaScript, RxJS, HTML, CSS/SCSS, Material Design' },
    { label: 'Backend', items: 'Node.js, PHP Laravel, Python Flask, REST APIs' },
    { label: 'Web3', items: 'Solidity, Ethereum, Web3.js, Smart Contracts' },
    { label: 'Tools', items: 'Git & GitHub, Docker, Figma' },
  ],
  languages: [
    { name: 'Greek', level: 'Native' },
    { name: 'English', level: 'Fluent (C2)' },
    { name: 'German', level: 'Intermediate (B2)' },
  ],
  education: {
    degree: 'B.Eng. Electrical & Computer Engineering',
    school: 'Technical University of Crete',
    year: '2023',
    thesis: 'Thesis: "Blockchain smart contract system for secure health data sharing"',
  },
};

const themes = {
  // Light blue sidebar, navy text and a cyan accent, matching the portfolio.
  ocean: {
    headingFont: 'Calibri',
    bodyFont: 'Calibri',
    mainBg: 'FFFFFF',
    sidebarBg: 'EAF4F8',
    sidebarHeading: '0B1F33',
    sidebarText: '1F3448',
    sidebarMuted: '5A7389',
    sidebarRule: 'B9DCE8',
    nameFirst: '0B1F33',
    nameLast: '0891B2',
    title: '0891B2',
    heading: '0B1F33',
    role: '0B1F33',
    summary: '3A4A5A',
    body: '2C3E50',
    meta: '5A7389',
    accent: '0891B2',
    sizes: { name: 60, title: 22, summary: 21, role: 24, meta: 19, bullet: 20, side: 19, sideSmall: 18 },
  },
  // The original dark espresso sidebar with gold, in serif fonts.
  espresso: {
    headingFont: 'Georgia',
    bodyFont: 'Garamond',
    mainBg: 'F7F3EC',
    sidebarBg: '362B1E',
    sidebarHeading: 'FFFFFF',
    sidebarText: 'EDE6DA',
    sidebarMuted: 'AD9A85',
    sidebarRule: 'AD9A85',
    nameFirst: '362B1E',
    nameLast: '362B1E',
    title: 'AD9A85',
    heading: '362B1E',
    role: '181818',
    summary: '3A3A3A',
    body: '2B2B2B',
    meta: '5C5C5C',
    accent: 'B08D57',
    sizes: { name: 58, title: 20, summary: 22, role: 25, meta: 20, bullet: 21, side: 20, sideSmall: 19 },
  },
};

const T = themes[themeName];
if (!T) {
  console.error(`Unknown theme "${themeName}". Use one of: ${Object.keys(themes).join(', ')}`);
  process.exit(1);
}
const S = T.sizes;

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function cell({ children, width, shading, margins }) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: noBorders,
    shading,
    verticalAlign: VerticalAlign.TOP,
    margins: margins ?? { top: 0, bottom: 0, left: 0, right: 0 },
    children,
  });
}

function text(value, opts = {}) {
  return new TextRun({ text: value, font: T.bodyFont, ...opts });
}

function sidebarLabel(label) {
  return new Paragraph({
    spacing: { before: 380, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: T.sidebarRule, space: 4 } },
    children: [
      text(label.toUpperCase(), {
        bold: true,
        size: 20,
        color: T.sidebarHeading,
        font: T.headingFont,
        characterSpacing: 20,
      }),
    ],
  });
}

function mainLabel(label) {
  return new Paragraph({
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: T.accent, space: 4 } },
    children: [
      text(label.toUpperCase(), {
        bold: true,
        size: 22,
        color: T.heading,
        font: T.headingFont,
        characterSpacing: 20,
      }),
    ],
  });
}

// Colored dot bullets with a hanging indent so wrapped lines line up under the text.
function bulletParagraph(value) {
  return new Paragraph({
    spacing: { after: 60, line: 276 },
    indent: { left: 240, hanging: 240 },
    children: [text('●  ', { color: T.accent, size: 12 }), text(value, { size: S.bullet, color: T.body })],
  });
}

const photoBuffer = readFileSync(photoPath);

// --- Sidebar: photo, title, contact, education, skills, languages ---

const sidebarChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new ImageRun({ data: photoBuffer, type: 'jpg', transformation: { width: 150, height: 150 } })],
  }),

  sidebarLabel('Contact'),
  ...profile.contact.map(
    (value) =>
      new Paragraph({
        spacing: { after: 90 },
        children: [text(value, { size: S.side, color: T.sidebarText })],
      }),
  ),

  sidebarLabel('Education'),
  new Paragraph({
    spacing: { after: 40 },
    children: [
      text(profile.education.degree, { bold: true, size: S.side, color: T.sidebarHeading, font: T.headingFont }),
    ],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [text(`${profile.education.school} · ${profile.education.year}`, { size: S.sideSmall, color: T.sidebarMuted })],
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [text(profile.education.thesis, { italics: true, size: S.sideSmall, color: T.sidebarMuted })],
  }),

  sidebarLabel('Skills'),
  ...profile.skillGroups.flatMap((group) => [
    new Paragraph({
      spacing: { after: 20 },
      children: [text(group.label, { bold: true, size: S.sideSmall, color: T.accent, font: T.headingFont })],
    }),
    new Paragraph({
      spacing: { after: 110, line: 264 },
      children: [text(group.items, { size: S.side, color: T.sidebarText })],
    }),
  ]),

  sidebarLabel('Languages'),
  ...profile.languages.map(
    (lang) =>
      new Paragraph({
        spacing: { after: 60 },
        children: [
          text(lang.name, { size: S.side, color: T.sidebarText }),
          text(`  ${lang.level}`, { italics: true, size: S.sideSmall, color: T.sidebarMuted }),
        ],
      }),
  ),
];

// --- Main column: name, title, summary, work experience ---

const mainChildren = [
  new Paragraph({
    spacing: { after: 40 },
    children: [
      text(profile.name.first.toUpperCase() + ' ', {
        bold: true,
        size: S.name,
        color: T.nameFirst,
        font: T.headingFont,
        characterSpacing: 10,
      }),
      text(profile.name.last.toUpperCase(), {
        bold: true,
        size: S.name,
        color: T.nameLast,
        font: T.headingFont,
        characterSpacing: 10,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: T.accent, space: 10 } },
    children: [
      text(profile.jobTitle.toUpperCase(), {
        bold: true,
        size: S.title,
        color: T.title,
        font: T.headingFont,
        characterSpacing: 40,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 60, line: 300 },
    children: [text(profile.summary, { size: S.summary, color: T.summary })],
  }),

  mainLabel('Work Experience'),
  ...profile.experience.flatMap((job) => [
    new Paragraph({
      spacing: { before: 220, after: 20 },
      children: [text(job.role, { bold: true, size: S.role, color: T.role, font: T.headingFont })],
    }),
    new Paragraph({
      spacing: { after: 90 },
      children: [
        text(job.company, { bold: true, size: S.meta, color: T.accent }),
        text(`  ·  ${job.dates}`, { size: S.meta, color: T.meta }),
      ],
    }),
    ...job.bullets.map(bulletParagraph),
  ]),
];

// --- Page: one table, one row, sidebar and main column side by side ---

const CELL_TOP = 620;
const CELL_BOTTOM = 400;
// The tiny paragraph Word always places after a table (see tailParagraph), plus a little slack.
const TAIL_ROOM = 60;

const pageTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: noBorders,
  rows: [
    new TableRow({
      // Fills the page so the sidebar color reaches the bottom. Word adds the
      // cell padding on top of this height, so subtract it, and leave room for
      // the closing paragraph so it doesn't spill onto an empty second page.
      height: { value: A4_HEIGHT - CELL_TOP - CELL_BOTTOM - TAIL_ROOM, rule: HeightRule.ATLEAST },
      cantSplit: true,
      children: [
        cell({
          width: 34,
          shading: { type: ShadingType.CLEAR, color: 'auto', fill: T.sidebarBg },
          margins: { top: CELL_TOP, bottom: CELL_BOTTOM, left: 400, right: 380 },
          children: sidebarChildren,
        }),
        cell({
          width: 66,
          shading: { type: ShadingType.CLEAR, color: 'auto', fill: T.mainBg },
          margins: { top: CELL_TOP, bottom: CELL_BOTTOM, left: 480, right: 480 },
          children: mainChildren,
        }),
      ],
    }),
  ],
});

// The paragraph Word always needs after a table, made tiny so it can't spill onto a new page.
const tailParagraph = new Paragraph({
  spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT },
  children: [new TextRun({ text: '', size: 2 })],
});

const doc = new Document({
  background: { color: T.mainBg },
  styles: {
    default: {
      document: { run: { font: T.bodyFont, size: 20, color: T.body } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: A4_WIDTH, height: A4_HEIGHT },
          margin: { top: 0, bottom: 0, left: 0, right: 0, header: 0, footer: 0 },
        },
      },
      children: [pageTable, tailParagraph],
    },
  ],
});

// Converts the .docx to PDF with Microsoft Word (Windows only).
function convertToPdf(docxPath, pdfPath) {
  const ps = [
    '$ErrorActionPreference = "Stop"',
    '$w = New-Object -ComObject Word.Application',
    '$w.Visible = $false',
    'try {',
    `  $d = $w.Documents.Open('${docxPath}', $false, $true)`,
    `  $d.SaveAs([ref]'${pdfPath}', [ref]17)`,
    '  $pages = $d.ComputeStatistics(2)',
    '  $d.Close($false)',
    '  Write-Output $pages',
    '} finally { $w.Quit() }',
  ].join('\n');
  const pages = execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { encoding: 'utf8' }).trim();
  return Number(pages);
}

async function main() {
  if (!existsSync(exportsDir)) {
    mkdirSync(exportsDir, { recursive: true });
  }
  const base = themeName === 'ocean' ? 'georgios-vasilakis-cv' : `georgios-vasilakis-cv-${themeName}`;
  const outPath = path.join(exportsDir, `${base}.docx`);
  writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log(`Saved ${outPath}`);

  if (wantPdf) {
    const pdfPath = path.join(exportsDir, `${base}.pdf`);
    const pages = convertToPdf(outPath, pdfPath);
    console.log(`Saved ${pdfPath} (${pages} page${pages === 1 ? '' : 's'})`);
    if (pages > 1) {
      console.warn('Warning: the CV is longer than one page.');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
