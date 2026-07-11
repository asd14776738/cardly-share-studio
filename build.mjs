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

const worker = String.raw`const files = ${JSON.stringify({
  '/': ['text/html; charset=utf-8', html],
  '/index.html': ['text/html; charset=utf-8', html],
  '/styles.css': ['text/css; charset=utf-8', css],
  '/app.js': ['text/javascript; charset=utf-8', js],
})};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/extract') {
      try {
        const target = new URL(url.searchParams.get('url') || '');
        const host = target.hostname.toLowerCase();
        const privateHost = host === 'localhost' || host.endsWith('.local') || /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(host);
        if (!['http:', 'https:'].includes(target.protocol) || privateHost) throw new Error('Unsupported URL');
        const upstream = await fetch(target.toString(), {
          headers: { 'user-agent': 'Mozilla/5.0 Cardly Preview' },
          redirect: 'follow',
        });
        if (!upstream.ok) throw new Error('Upstream unavailable');
        const text = (await upstream.text()).slice(0, 1000000);
        const metadata = {};
        for (const tag of text.match(/<meta\b[^>]*>/gi) || []) {
          const key = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
          const content = tag.match(/content=["']([^"']*)["']/i)?.[1];
          if (key && content && !metadata[key]) metadata[key] = content;
        }
        const titleMatch = text.match(/<title[^>]*>([^<]*)<\/title>/i);
        const decode = (value) => String(value || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
        const image = metadata['og:image'] || metadata['twitter:image'] || '';
        return Response.json({
          title: decode(metadata['og:title'] || metadata['twitter:title'] || titleMatch?.[1]),
          description: decode(metadata['og:description'] || metadata.description || metadata['twitter:description']),
          image: image ? new URL(decode(image), target).toString() : '',
          host: target.hostname,
        }, { headers: { 'cache-control': 'no-store' } });
      } catch {
        return Response.json({ error: 'Unable to extract public metadata' }, { status: 422 });
      }
    }
    const file = files[url.pathname] || files['/'];
    return new Response(file[1], {
      headers: {
        'content-type': file[0],
        'cache-control': 'no-cache, no-store, must-revalidate',
        'x-content-type-options': 'nosniff',
      },
    });
  },
};
`;

await writeFile('dist/server/index.js', worker);
await writeFile('dist/.openai/hosting.json', hosting);
console.log('Cardly Sites worker build ready.');