import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const [html, css, js, readingTime, hosting, workerTemplate] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('app.js', 'utf8'),
  readFile('reading-time.js', 'utf8'),
  readFile('.openai/hosting.json', 'utf8'),
  readFile('worker-template.js', 'utf8'),
]);

const files = {
  '/': ['text/html; charset=utf-8', html],
  '/index.html': ['text/html; charset=utf-8', html],
  '/styles.css': ['text/css; charset=utf-8', css],
  '/app.js': ['text/javascript; charset=utf-8', js],
  '/reading-time.js': ['text/javascript; charset=utf-8', readingTime],
};

const worker = workerTemplate.replace('__FILES__', JSON.stringify(files));
await writeFile('dist/server/index.js', worker);
await writeFile('dist/.openai/hosting.json', hosting);
console.log('Cardly Sites worker build ready.');
