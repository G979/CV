import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const browserDistDir = path.join(rootDir, 'dist', 'gcv', 'browser');
const exportsDir = path.join(rootDir, 'exports');

const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const strict = args.includes('--strict');

const A4_HEIGHT_PX = 1123; // 297mm at 96dpi

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function startServer(dir) {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(express.static(dir, { index: 'index.html' }));

    function tryListen(port, attemptsLeft) {
      const server = app.listen(port, () => resolve({ server, port }));
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
          tryListen(port + 1, attemptsLeft - 1);
        } else {
          reject(err);
        }
      });
    }

    tryListen(4321, 10);
  });
}

async function main() {
  if (!skipBuild) {
    console.log('Building static output (npx ng build --output-mode=static --configuration=production)...');
    execSync('npx ng build --output-mode=static --configuration=production', {
      cwd: rootDir,
      stdio: 'inherit',
    });
  }

  if (!existsSync(browserDistDir)) {
    console.error(`Build output not found at ${browserDistDir}`);
    process.exit(1);
  }

  console.log('Starting local static server...');
  const { server, port } = await startServer(browserDistDir);
  const url = `http://localhost:${port}/`;
  console.log(`Serving ${browserDistDir} at ${url}`);

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({ headless: 'new' });

  let warned = false;
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 2000 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.cv-page');
    await page.evaluate(() => document.fonts.ready);

    const { scrollHeight, profileId, name } = await page.evaluate(() => {
      const el = document.querySelector('.cv-page');
      return {
        scrollHeight: el.scrollHeight,
        profileId: el.getAttribute('data-profile-id') || 'profile',
        name: document.querySelector('.cv-name')?.textContent?.trim() || 'cv',
      };
    });

    if (scrollHeight > A4_HEIGHT_PX) {
      const overPx = scrollHeight - A4_HEIGHT_PX;
      const overMm = (overPx * 297) / A4_HEIGHT_PX;
      warned = true;
      console.warn(
        `Warning: profile "${profileId}" content is ${overPx}px (${overMm.toFixed(1)}mm) taller than one A4 page.`,
      );
    } else {
      console.log(`Content fits one A4 page (${scrollHeight}px / ${A4_HEIGHT_PX}px).`);
    }

    if (!existsSync(exportsDir)) {
      mkdirSync(exportsDir, { recursive: true });
    }

    const date = new Date().toISOString().slice(0, 10);
    const fileName = `${slugify(profileId)}-${slugify(name)}-${date}.pdf`;
    const outPath = path.join(exportsDir, fileName);

    console.log('Generating PDF...');
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    console.log(`Saved ${outPath}`);
  } finally {
    await browser.close();
    server.close();
  }

  if (strict && warned) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
