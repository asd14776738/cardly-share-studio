const files = __FILES__;

const PLATFORM_RULES = [
  ['x', 'X', h => h === 'x.com' || h === 'twitter.com' || h.endsWith('.twitter.com')],
  ['weibo', '微博', h => h === 'weibo.com' || h.endsWith('.weibo.com')],
  ['wechat', '微信公众号', h => h === 'mp.weixin.qq.com'],
  ['zhihu', '知乎', h => h === 'zhihu.com' || h.endsWith('.zhihu.com')],
  ['xiaohongshu', '小红书', h => h === 'xiaohongshu.com' || h.endsWith('.xiaohongshu.com') || h === 'xhslink.com'],
  ['jike', '即刻', h => h === 'okjike.com' || h.endsWith('.okjike.com')],
  ['instagram', 'Instagram', h => h === 'instagram.com' || h.endsWith('.instagram.com')],
  ['threads', 'Threads', h => h === 'threads.net' || h.endsWith('.threads.net')],
  ['douban', '豆瓣', h => h === 'douban.com' || h.endsWith('.douban.com')],
  ['telegram', 'Telegram', h => h === 't.me' || h === 'telegram.me'],
  ['douyin', '抖音', h => h === 'douyin.com' || h.endsWith('.douyin.com') || h === 'v.douyin.com'],
  ['netease_music', '网易云音乐', h => h === 'music.163.com'],
  ['qq_music', 'QQ音乐', h => h === 'y.qq.com' || h.endsWith('.y.qq.com')],
  ['apple_music', 'Apple Music', h => h === 'music.apple.com'],
  ['spotify', 'Spotify', h => h === 'open.spotify.com'],
  ['chatgpt', 'ChatGPT', h => h === 'chatgpt.com' || h === 'chat.openai.com'],
  ['kimi', 'Kimi', h => h === 'kimi.com' || h.endsWith('.kimi.com') || h === 'kimi.moonshot.cn'],
];

function platformFor(target) {
  const host = target.hostname.toLowerCase().replace(/^www\./, '');
  const match = PLATFORM_RULES.find(([, , test]) => test(host));
  return match ? { platform: match[0], platformLabel: match[1] } : { platform: 'web', platformLabel: host };
}

function isPrivate(target) {
  const h = target.hostname.toLowerCase();
  return h === 'localhost' || h.endsWith('.local') || h === '0.0.0.0' ||
    /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(h) ||
    h === '::1' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80:');
}

function safeUrl(value, base) {
  try {
    const parsed = new URL(value, base);
    return ['http:', 'https:'].includes(parsed.protocol) && !isPrivate(parsed) ? parsed : null;
  } catch { return null; }
}

function decode(value) {
  return String(value || '')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#x2F;/gi, '/')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).trim();
}

function textOnly(value) {
  return decode(String(value || '').replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function proxied(src, requestUrl) {
  const valid = safeUrl(src);
  if (!valid) return '';
  const proxy = new URL('/api/image', requestUrl);
  proxy.searchParams.set('url', valid.toString());
  return proxy.toString();
}

function finalResult(data, target, requestUrl) {
  const base = platformFor(target);
  const directImages = unique((data.images || []).map(value => safeUrl(decode(value), target)?.toString() || ''));
  const images = directImages.map(value => proxied(value, requestUrl)).filter(Boolean).slice(0, 12);
  return {
    ...base,
    host: target.hostname,
    title: textOnly(data.title),
    description: textOnly(data.description).replace(/https:\/\/t\.co\/\w+\s*$/i, '').trim(),
    author: textOnly(data.author),
    images,
    image: images[0] || '',
    imageCount: images.length,
    strategy: data.strategy || 'html-metadata',
    status: data.status || 'ok',
  };
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.7',
      ...headers,
    },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error('Upstream unavailable: ' + response.status);
  return { response, text: (await response.text()).slice(0, 2000000) };
}

function parseMeta(html, target) {
  const metas = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = {};
    for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
    }
    const key = (attrs.property || attrs.name || attrs.itemprop || '').toLowerCase();
    if (key && attrs.content) (metas[key] ||= []).push(attrs.content);
  }
  const get = (...keys) => keys.flatMap(key => metas[key] || []).find(Boolean) || '';
  const images = [
    ...(metas['og:image'] || []), ...(metas['og:image:url'] || []),
    ...(metas['twitter:image'] || []), ...(metas['twitter:image:src'] || []),
  ];
  for (const script of html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []) {
    try {
      const json = JSON.parse(script.replace(/^.*?>/s, '').replace(/<\/script>$/i, ''));
      const walk = value => {
        if (!value || typeof value !== 'object') return;
        const image = value.image || value.thumbnailUrl;
        if (typeof image === 'string') images.push(image);
        else if (Array.isArray(image)) image.forEach(item => images.push(typeof item === 'string' ? item : item?.url));
        else if (image?.url) images.push(image.url);
        Object.values(value).forEach(child => {
          if (child && typeof child === 'object' && child !== image) walk(child);
        });
      };
      walk(json);
    } catch {}
  }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return {
    title: get('og:title', 'twitter:title') || titleMatch?.[1] || '',
    description: get('og:description', 'description', 'twitter:description'),
    author: get('author', 'article:author'),
    images: unique(images.map(value => safeUrl(decode(value), target)?.toString() || '')),
    strategy: 'html-metadata',
  };
}

async function extractX(target, requestUrl) {
  const id = target.pathname.match(/\/status\/(\d+)/)?.[1];
  if (!id) throw new Error('Missing X status id');
  const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
  const api = new URL('https://cdn.syndication.twimg.com/tweet-result');
  api.searchParams.set('id', id);
  api.searchParams.set('lang', 'zh-cn');
  api.searchParams.set('token', token);
  const response = await fetch(api, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error('X public data unavailable');
  const tweet = await response.json();
  const photos = [
    ...(tweet.mediaDetails || []).filter(item => item.type === 'photo').map(item => item.media_url_https || item.media_url),
    ...(tweet.photos || []).map(item => item.url),
  ];
  const user = tweet.user || {};
  return finalResult({
    title: user.name ? user.name + (user.screen_name ? ' (@' + user.screen_name + ') on X' : ' on X') : 'X Post',
    description: tweet.text || '',
    author: user.screen_name ? '@' + user.screen_name : user.name,
    images: photos,
    strategy: 'x-syndication',
  }, target, requestUrl);
}

async function extractSpotify(target, requestUrl) {
  const endpoint = new URL('https://open.spotify.com/oembed');
  endpoint.searchParams.set('url', target.toString());
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Spotify oEmbed unavailable');
  const data = await response.json();
  return finalResult({
    title: data.title,
    description: data.author_name ? 'by ' + data.author_name : '',
    author: data.author_name,
    images: [data.thumbnail_url],
    strategy: 'spotify-oembed',
  }, target, requestUrl);
}

async function extractWeibo(target, requestUrl) {
  const id = target.pathname.split('/').filter(Boolean).pop();
  if (id) {
    try {
      const api = new URL('https://weibo.com/ajax/statuses/show');
      api.searchParams.set('id', id);
      const response = await fetch(api, {
        headers: { 'user-agent': 'Mozilla/5.0', referer: target.origin + '/' },
      });
      if (response.ok) {
        const post = await response.json();
        const pictures = (post.pic_infos ? Object.values(post.pic_infos) : post.pics || [])
          .map(item => item.largest?.url || item.large?.url || item.original?.url || item.url);
        return finalResult({
          title: post.user?.screen_name ? post.user.screen_name + ' 的微博' : '微博',
          description: post.text_raw || post.text || '',
          author: post.user?.screen_name || '',
          images: pictures,
          strategy: 'weibo-public-json',
        }, target, requestUrl);
      }
    } catch {}
  }
  const { text } = await fetchText(target);
  if (/Sina Visitor System|passport\.weibo\.com/i.test(text)) {
    return finalResult({ title: '微博', description: '', images: [], strategy: 'weibo-login-wall', status: 'login_required' }, target, requestUrl);
  }
  return finalResult(parseMeta(text, target), target, requestUrl);
}

async function extractGeneric(target, requestUrl) {
  const { response, text } = await fetchText(target);
  const finalTarget = safeUrl(response.url) || target;
  const data = parseMeta(text, finalTarget);
  if (/Sina Visitor System/i.test(data.title) || /登录.*小红书|安全验证|verify/i.test(data.title)) data.status = 'login_required';
  return finalResult(data, finalTarget, requestUrl);
}

async function extract(target, requestUrl) {
  const { platform } = platformFor(target);
  if (platform === 'x') return extractX(target, requestUrl);
  if (platform === 'spotify') return extractSpotify(target, requestUrl);
  if (platform === 'weibo') return extractWeibo(target, requestUrl);
  return extractGeneric(target, requestUrl);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/image') {
      try {
        const target = safeUrl(url.searchParams.get('url') || '');
        if (!target) throw new Error('Unsupported image URL');
        const upstream = await fetch(target, {
          headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
            accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            referer: target.origin + '/',
          },
          redirect: 'follow',
        });
        if (!upstream.ok) throw new Error('Image unavailable');
        const type = upstream.headers.get('content-type') || '';
        if (!type.startsWith('image/')) throw new Error('Not an image');
        return new Response(upstream.body, {
          headers: {
            'content-type': type,
            'cache-control': 'public, max-age=86400',
            'x-content-type-options': 'nosniff',
            'access-control-allow-origin': '*',
          },
        });
      } catch {
        return new Response('Image unavailable', { status: 422 });
      }
    }
    if (url.pathname === '/api/extract') {
      try {
        const target = safeUrl(url.searchParams.get('url') || '');
        if (!target) throw new Error('Unsupported URL');
        return Response.json(await extract(target, request.url), {
          headers: { 'cache-control': 'no-store', 'access-control-allow-origin': '*' },
        });
      } catch (error) {
        return Response.json({ error: 'Unable to extract public content', detail: String(error?.message || error) }, {
          status: 422,
          headers: { 'cache-control': 'no-store' },
        });
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
