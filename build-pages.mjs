import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const output = 'docs';
const files = [
  'index.html',
  'styles.css',
  'studio-v3.css',
  'app.js',
  'reading-time.js',
  'media-layout.js',
  'palette-engine.js',
  'source-link.js',
  'hashtags.js',
  'history-store.js',
  'history-view.js',
  'draft-session.js',
  'extract-feedback.js',
  'source-input.js',
  'export-readiness.js',
  'ratio-layout.js',
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(files.map(file => cp(file, output + '/' + file)));
await cp('assets', output + '/assets', { recursive: true });
const htmlPath = output + '/index.html';
const html = await readFile(htmlPath, 'utf8');
const quote = String.fromCharCode(34);
await writeFile(htmlPath, html.replaceAll('src=' + quote + '/assets/', 'src=' + quote + './assets/'));
await writeFile(output + '/.nojekyll', '');
console.log('GitHub Pages bundle ready.');
