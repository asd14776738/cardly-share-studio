import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const [html, css, studioCss, js, readingTime, mediaLayout, paletteEngine, sourceLink, hashtags, hosting, workerTemplate] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('studio-v3.css', 'utf8'),
  readFile('app.js', 'utf8'),
  readFile('reading-time.js', 'utf8'),
  readFile('media-layout.js', 'utf8'),
  readFile('palette-engine.js', 'utf8'),
  readFile('source-link.js', 'utf8'),
  readFile('hashtags.js', 'utf8'),
  readFile('.openai/hosting.json', 'utf8'),
  readFile('worker-template.js', 'utf8'),
]);

const files = {
  '/': ['text/html; charset=utf-8', html],
  '/index.html': ['text/html; charset=utf-8', html],
  '/styles.css': ['text/css; charset=utf-8', css],
  '/studio-v3.css': ['text/css; charset=utf-8', studioCss],
  '/app.js': ['text/javascript; charset=utf-8', js],
  '/reading-time.js': ['text/javascript; charset=utf-8', readingTime],
  '/media-layout.js': ['text/javascript; charset=utf-8', mediaLayout],
  '/palette-engine.js': ['text/javascript; charset=utf-8', paletteEngine],
  '/source-link.js': ['text/javascript; charset=utf-8', sourceLink],
  '/hashtags.js': ['text/javascript; charset=utf-8', hashtags],
};

for (const iconName of await readdir('assets/icons')) {
  files['/assets/icons/' + iconName] = ['image/svg+xml; charset=utf-8', await readFile('assets/icons/' + iconName, 'utf8')];
}

const worker = workerTemplate.replace('__FILES__', JSON.stringify(files));
await writeFile('dist/server/index.js', worker);
await writeFile('dist/.openai/hosting.json', hosting);
console.log('Cardly Sites worker build ready.');
