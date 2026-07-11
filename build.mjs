import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const [html, css, js, hosting] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('app.js', 'utf8'),
  readFile('.openai/hosting.json', 'utf8'),
]);

const worker = `const files = ${JSON.stringify({
  '/': ['text/html; charset=utf-8', html],
  '/index.html': ['text/html; charset=utf-8', html],
  '/styles.css': ['text/css; charset=utf-8', css],
  '/app.js': ['text/javascript; charset=utf-8', js],
})};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const file = files[url.pathname] || files['/'];
    return new Response(file[1], {
      headers: {
        'content-type': file[0],
        'cache-control': url.pathname === '/' ? 'no-cache' : 'public, max-age=3600',
        'x-content-type-options': 'nosniff',
      },
    });
  },
};
`;

await writeFile('dist/server/index.js', worker);
await writeFile('dist/.openai/hosting.json', hosting);
console.log('Cardly Sites worker build ready.');