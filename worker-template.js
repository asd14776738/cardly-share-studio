const files = __FILES__;

const PLATFORM_RULES = [
  ['x', 'X', h => h === 'x.com' || h === 'twitter.com' || h.endsWith('.twitter.com')],
  ['weibo', '微博', h => h === 'weibo.com' || h.endsWith('.weibo.com')],
  ['wechat', '微信公众号', h => h === 'mp.weixin.qq.com'],
  ['zhihu', '知乎', h => h === 'zhihu.com' || h.endsWith('.zhihu.com')],
  ['xiaohongshu', '小红书', h => h === 'xiaohongshu.com' || h.endsWith('.xiaohongshu.com') || h === 'xhslink.com'],
  ['jike', '即刻', h => h === 'okjike.com' || h.endsWith('.okjike.com')],
  ['instagram', 'Instagram', h => h === 'instagram.com' || h.endsWith('.instagram.com')],
  ['threads', 'Threads', h => h === 'threads.net' || h.endsWith('.threads.net') || h === 'threads.com' || h.endsWith('.threads.com')],
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

function firstValue(...values) {
  return values.find(value => value !== undefined && value !== null && value !== '') || '';
}

function decodeJsString(value) {
  try { return JSON.parse('"' + String(value || '').replace(/"/g, '\\"') + '"'); }
  catch { return decode(value); }
}

function parseJsonBlock(html, pattern) {
  const raw = html.match(pattern)?.[1];
  if (!raw) return null;
  try { return JSON.parse(raw.trim().replace(/;$/, '').replace(/\bundefined\b/g, 'null')); }
  catch { return null; }
}

function findBestObject(root, scorer) {
  let best = null;
  let bestScore = 0;
  const seen = new Set();
  const walk = value => {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    const score = scorer(value);
    if (score > bestScore) { best = value; bestScore = score; }
    if (seen.size > 25000) return;
    for (const child of Object.values(value)) walk(child);
  };
  walk(root);
  return best;
}

function imagesFromHtml(html, base) {
  const images = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const value = tag.match(/(?:data-src|data-original|src)=["']([^"']+)["']/i)?.[1];
    if (!value) continue;
    const valid = safeUrl(decode(value), base);
    if (valid) images.push(valid.toString());
  }
  return unique(images);
}

function imageValues(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return unique(list.flatMap(item => {
    if (typeof item === 'string') return [item];
    if (!item || typeof item !== 'object') return [];
    const nested = item.infoList || item.urlList || item.url_list || item.urls || [];
    return [
      item.urlDefault, item.urlPre, item.url, item.src, item.originUrl, item.original,
      item.picUrl, item.thumbnailUrl,
      ...(Array.isArray(nested) ? nested.map(entry => typeof entry === 'string' ? entry : entry?.url) : []),
    ];
  }));
}

function proxied(src, requestUrl) {
  const valid = safeUrl(src);
  if (!valid) return '';
  const proxy = new URL('/api/image', requestUrl);
  proxy.searchParams.set('url', valid.toString());
  return proxy.toString();
}

function imageReferer(target) {
  const host = target.hostname.toLowerCase();
  if (host.includes('twimg.com')) return 'https://x.com/';
  if (host.includes('sinaimg.cn')) return 'https://weibo.com/';
  if (host.includes('mmbiz.qpic.cn')) return 'https://mp.weixin.qq.com/';
  if (host.includes('xhscdn.com')) return 'https://www.xiaohongshu.com/';
  if (host.includes('zhimg.com')) return 'https://www.zhihu.com/';
  if (host.includes('music.126.net')) return 'https://music.163.com/';
  if (host.includes('gtimg.cn')) return 'https://y.qq.com/';
  if (host.includes('okjike.com')) return 'https://web.okjike.com/';
  return target.origin + '/';
}

function finalResult(data, target, requestUrl) {
  const base = platformFor(target);
  const directImages = unique((data.images || []).map(value => {
    const decoded = decode(value);
    return decoded ? safeUrl(decoded, target)?.toString() || '' : '';
  }));
  const images = directImages.map(value => proxied(value, requestUrl)).filter(Boolean).slice(0, 12);
  const title = textOnly(data.title);
  const description = textOnly(data.description).replace(/https:\/\/t\.co\/\w+\s*$/i, '').trim();
  const status = data.status || (title && (description || images.length) ? 'ok' : 'partial');
  return {
    ...base,
    host: target.hostname,
    title,
    description,
    author: textOnly(data.author),
    images,
    image: images[0] || '',
    imageCount: images.length,
    strategy: data.strategy || 'html-metadata',
    status,
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
  return { response, text: (await response.text()).slice(0, 5000000) };
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

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.7',
      accept: 'application/json,text/plain,*/*',
      ...headers,
    },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error('JSON upstream unavailable: ' + response.status);
  return response.json();
}

async function extractZhihu(target, requestUrl) {
  const questionId = target.pathname.match(/\/question\/(\d+)/)?.[1];
  const answerId = target.pathname.match(/\/answer\/(\d+)/)?.[1];
  const articleId = target.pathname.match(/\/p\/(\d+)/)?.[1];
  if (answerId || articleId || questionId) {
    try {
      const endpoint = answerId
        ? new URL('https://api.zhihu.com/answers/' + answerId)
        : articleId
          ? new URL('https://api.zhihu.com/articles/' + articleId)
          : new URL('https://api.zhihu.com/questions/' + questionId);
      endpoint.searchParams.set('include', 'content,excerpt,author,question,thumbnail,detail');
      const item = await fetchJson(endpoint, { referer: target.toString() });
      const content = firstValue(item.content, item.detail, item.excerpt, item.description);
      const title = firstValue(item.title, item.question?.title);
      const author = item.author || {};
      return finalResult({
        title,
        description: content,
        author: firstValue(author.name, author.url_token),
        images: unique([
          ...imageValues(firstValue(item.image_url, item.thumbnail)),
          ...imagesFromHtml(content, target),
        ]),
        strategy: answerId ? 'zhihu-answer-api' : articleId ? 'zhihu-article-api' : 'zhihu-question-api',
      }, target, requestUrl);
    } catch {}
  }
  const { response, text } = await fetchText(target);
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const state = parseJsonBlock(text, /<script[^>]+id=["']js-initialData["'][^>]*>([\s\S]*?)<\/script>/i);
  const entities = state?.initialState?.entities || state?.entities || {};
  const question = questionId ? entities.questions?.[questionId] : null;
  const answer = answerId ? entities.answers?.[answerId] : null;
  const article = articleId ? entities.articles?.[articleId] : null;
  const best = article || answer || question || findBestObject(state, value => {
    let score = 0;
    if (typeof value.content === 'string' && value.content.length > 80) score += 5;
    if (typeof value.title === 'string') score += 2;
    if (value.author?.name || value.author?.headline) score += 2;
    if (value.id || value.token) score += 1;
    return score;
  });
  const content = firstValue(best?.content, best?.detail, best?.excerpt, best?.description);
  return finalResult({
    title: firstValue(article?.title, question?.title, best?.title, meta.title),
    description: firstValue(content, meta.description),
    author: firstValue(best?.author?.name, best?.author?.urlToken, meta.author),
    images: unique([
      ...meta.images,
      ...imageValues(firstValue(best?.imageUrl, best?.image, best?.thumbnail)),
      ...imagesFromHtml(content, finalTarget),
    ]),
    strategy: 'zhihu-initial-state',
  }, finalTarget, requestUrl);
}

async function extractWechat(target, requestUrl) {
  const { response, text } = await fetchText(target, { referer: 'https://mp.weixin.qq.com/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const variable = name => {
    const pattern = new RegExp('(?:var\\s+)?' + name + '\\s*=\\s*([^;\\r\\n]+)', 'i');
    const rightHandSide = text.match(pattern)?.[1] || '';
    const quoted = rightHandSide.match(/"((?:\\\\.|[^"])*)"|'((?:\\\\.|[^'])*)'/);
    return decodeJsString(quoted?.[1] ?? quoted?.[2] ?? '');
  };
  const content = text.match(/<div[^>]+id=["']js_content["'][^>]*>([\s\S]*?)(?:<script\b|<div[^>]+id=["']js_pc_qr_code["'])/i)?.[1] || '';
  const contentText = textOnly(content);
  return finalResult({
    title: firstValue(variable('msg_title'), meta.title),
    description: firstValue(variable('msg_desc'), meta.description, contentText.slice(0, 4000)),
    author: firstValue(variable('nickname'), meta.author),
    images: unique([
      variable('msg_cdn_url'),
      ...imagesFromHtml(content, finalTarget),
      ...meta.images,
    ]),
    strategy: 'wechat-article-html',
    status: /环境异常|访问过于频繁|verify|验证码/i.test(meta.title + text.slice(0, 5000)) ? 'login_required' : 'ok',
  }, finalTarget, requestUrl);
}

async function extractXiaohongshu(target, requestUrl) {
  const { response, text } = await fetchText(target, { referer: 'https://www.xiaohongshu.com/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const state = parseJsonBlock(text, /window\.__INITIAL_STATE__\s*=\s*([\s\S]*?)<\/script>/i) ||
    parseJsonBlock(text, /<script[^>]+id=["']__INITIAL_STATE__["'][^>]*>([\s\S]*?)<\/script>/i);
  const note = findBestObject(state, value => {
    let score = 0;
    if (typeof value.desc === 'string' || typeof value.noteId === 'string' || typeof value.note_id === 'string') score += 4;
    if (Array.isArray(value.imageList) || Array.isArray(value.images)) score += 4;
    if (value.user?.nickname || value.user?.nickName) score += 2;
    if (typeof value.title === 'string') score += 1;
    return score;
  });
  const isNote = Boolean(note && (note.noteId || note.note_id || typeof note.desc === 'string' || Array.isArray(note.imageList)));
  const media = [
    ...imageValues(note?.imageList),
    ...imageValues(note?.images),
    ...imageValues(note?.cover),
  ];
  const blocked = /登录|安全验证|verify|captcha/i.test(meta.title + text.slice(0, 5000)) ||
    (!isNote && !meta.description && /小红书|ICP备/i.test(meta.title));
  return finalResult({
    title: firstValue(note?.title, note?.displayTitle, meta.title),
    description: firstValue(note?.desc, note?.description, meta.description),
    author: firstValue(note?.user?.nickname, note?.user?.nickName, note?.user?.name, meta.author),
    images: unique([...media, ...meta.images]),
    strategy: isNote ? 'xiaohongshu-initial-state' : blocked ? 'xiaohongshu-login-wall' : 'xiaohongshu-metadata',
    status: blocked ? 'login_required' : 'ok',
  }, finalTarget, requestUrl);
}

async function extractJike(target, requestUrl) {
  const { response, text } = await fetchText(target, { referer: 'https://web.okjike.com/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const state = parseJsonBlock(text, /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i) ||
    parseJsonBlock(text, /window\.__APOLLO_STATE__\s*=\s*([\s\S]*?)<\/script>/i);
  const post = findBestObject(state, value => {
    let score = 0;
    if (typeof value.content === 'string' || typeof value.text === 'string') score += 4;
    if (value.creator || value.user) score += 2;
    if (Array.isArray(value.pictures) || Array.isArray(value.images)) score += 3;
    if (value.id || value.postId) score += 1;
    return score;
  });
  const creator = post?.creator || post?.user || {};
  return finalResult({
    title: firstValue(post?.title, creator?.screenName && creator.screenName + ' 在即刻发布', meta.title),
    description: firstValue(post?.content, post?.text, post?.description, meta.description),
    author: firstValue(creator?.screenName, creator?.username, creator?.name, meta.author),
    images: unique([
      ...imageValues(post?.pictures),
      ...imageValues(post?.images),
      ...imageValues(post?.pictureUrls),
      ...meta.images,
    ]),
    strategy: state && post ? 'jike-ssr-state' : 'jike-metadata',
  }, finalTarget, requestUrl);
}

async function extractNeteaseMusic(target, requestUrl) {
  const id = target.searchParams.get('id') ||
    target.hash.match(/(?:song\?id=|song\/)(\d+)/)?.[1] ||
    target.pathname.match(/\/song\/(\d+)/)?.[1];
  if (!id) return extractGeneric(target, requestUrl, 'netease-metadata');
  const endpoint = new URL('https://music.163.com/api/song/detail/');
  endpoint.searchParams.set('ids', '[' + id + ']');
  const data = await fetchJson(endpoint, { referer: 'https://music.163.com/' });
  const song = data.songs?.[0];
  if (!song) throw new Error('NetEase song unavailable');
  const artists = (song.artists || song.ar || []).map(item => item.name).filter(Boolean).join(' / ');
  const album = song.album || song.al || {};
  return finalResult({
    title: song.name,
    description: [artists, album.name].filter(Boolean).join(' · '),
    author: artists,
    images: [album.picUrl],
    strategy: 'netease-song-api',
  }, target, requestUrl);
}

async function extractQQMusic(target, requestUrl) {
  const mid = target.searchParams.get('songmid') ||
    target.pathname.match(/\/(?:songDetail|song)\/([A-Za-z0-9]+)/i)?.[1];
  if (!mid) return extractGeneric(target, requestUrl, 'qqmusic-metadata');
  const endpoint = new URL('https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg');
  endpoint.searchParams.set('songmid', mid);
  endpoint.searchParams.set('format', 'json');
  endpoint.searchParams.set('platform', 'yqq');
  const data = await fetchJson(endpoint, { referer: 'https://y.qq.com/' });
  const song = data.data?.[0];
  if (!song) throw new Error('QQ Music song unavailable');
  const artists = (song.singer || []).map(item => item.name).filter(Boolean).join(' / ');
  const albumMid = firstValue(song.albummid, song.album?.mid);
  const cover = albumMid ? 'https://y.gtimg.cn/music/photo_new/T002R800x800M000' + albumMid + '.jpg' : '';
  return finalResult({
    title: firstValue(song.songname, song.name),
    description: [artists, firstValue(song.albumname, song.album?.name)].filter(Boolean).join(' · '),
    author: artists,
    images: [cover],
    strategy: 'qqmusic-song-api',
  }, target, requestUrl);
}

async function extractTelegram(target, requestUrl) {
  const parts = target.pathname.split('/').filter(Boolean);
  if (parts.length >= 2) {
    const embed = new URL('https://t.me/' + parts[0] + '/' + parts[1]);
    embed.searchParams.set('embed', '1');
    embed.searchParams.set('mode', 'tme');
    const { text } = await fetchText(embed);
    const body = text.match(/<div[^>]+class=["'][^"']*tgme_widget_message_text[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
    const author = textOnly(text.match(/<a[^>]+class=["'][^"']*tgme_widget_message_author_name[^"']*["'][^>]*>([\s\S]*?)<\/a>/i)?.[1] || '');
    const photos = [...text.matchAll(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/gi)].map(match => match[1]);
    const meta = parseMeta(text, embed);
    return finalResult({
      title: author ? author + ' · Telegram' : meta.title,
      description: firstValue(body, meta.description),
      author,
      images: unique([...photos, ...meta.images]),
      strategy: 'telegram-embed',
    }, target, requestUrl);
  }
  return extractGeneric(target, requestUrl, 'telegram-metadata');
}

async function extractInstagram(target, requestUrl) {
  const code = target.pathname.match(/\/(?:p|reel|tv)\/([^/]+)/i)?.[1];
  const source = code ? new URL('https://www.instagram.com/p/' + code + '/embed/captioned/') : target;
  const { text } = await fetchText(source, { referer: 'https://www.instagram.com/' });
  const meta = parseMeta(text, source);
  const displayUrls = [...text.matchAll(/"display_url"\s*:\s*"([^"]+)"/g)]
    .map(match => decodeJsString(match[1]).replace(/\\u0026/g, '&').replace(/\\\//g, '/'));
  const caption = text.match(/<div[^>]+class=["'][^"']*(?:Caption|caption)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
  return finalResult({
    title: meta.title,
    description: firstValue(meta.description, caption),
    author: meta.author,
    images: unique([...displayUrls, ...meta.images]),
    strategy: code ? 'instagram-embed' : 'instagram-page',
    status: /login|log in|登录/i.test(meta.title) ? 'login_required' : 'ok',
  }, target, requestUrl);
}

async function extractDouban(target, requestUrl) {
  const id = target.pathname.match(/\/subject\/(\d+)/)?.[1];
  if (id) {
    try {
      const host = target.hostname.toLowerCase();
      const type = host.startsWith('book.') ? 'book' : host.startsWith('music.') ? 'music' : 'movie';
      const endpoint = new URL('https://m.douban.com/rexxar/api/v2/' + type + '/' + id);
      const item = await fetchJson(endpoint, { referer: target.toString() });
      const creators = type === 'book'
        ? (item.author || item.authors || []).map(value => typeof value === 'string' ? value : value.name)
        : (item.directors || []).map(value => value.name);
      const cast = (item.actors || []).slice(0, 3).map(value => value.name).filter(Boolean);
      return finalResult({
        title: item.title,
        description: firstValue(item.intro, item.card_subtitle, [creators.join(' / '), cast.join(' / ')].filter(Boolean).join(' · ')),
        author: creators.filter(Boolean).join(' / '),
        images: [item.pic?.large, item.pic?.normal, item.cover_url, item.cover],
        strategy: 'douban-rexxar-api',
      }, target, requestUrl);
    } catch {}
  }
  const { response, text } = await fetchText(target, { referer: 'https://www.douban.com/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const summary = text.match(/<(?:span|div)[^>]+(?:property=["']v:summary["']|id=["']link-report["'])[^>]*>([\s\S]*?)<\/(?:span|div)>/i)?.[1] || '';
  const author = textOnly(text.match(/<a[^>]+rel=["']v:directedBy["'][^>]*>([\s\S]*?)<\/a>/i)?.[1] || '');
  return finalResult({
    ...meta,
    description: firstValue(summary, meta.description),
    author: firstValue(author, meta.author),
    strategy: 'douban-structured-page',
  }, finalTarget, requestUrl);
}

async function extractDouyin(target, requestUrl) {
  const { response, text } = await fetchText(target, { referer: 'https://www.douyin.com/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const raw = text.match(/<script[^>]+id=["']RENDER_DATA["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  let state = null;
  if (raw) {
    try { state = JSON.parse(decodeURIComponent(decode(raw))); } catch {}
  }
  const aweme = findBestObject(state, value => {
    let score = 0;
    if (value.aweme_id || value.awemeId) score += 4;
    if (typeof value.desc === 'string') score += 3;
    if (value.video || value.images) score += 3;
    if (value.author?.nickname) score += 2;
    return score;
  });
  const video = aweme?.video || {};
  return finalResult({
    title: firstValue(aweme?.desc, meta.title),
    description: firstValue(aweme?.desc, meta.description),
    author: firstValue(aweme?.author?.nickname, aweme?.author?.unique_id, meta.author),
    images: unique([
      ...imageValues(aweme?.images),
      ...imageValues(video.cover),
      ...imageValues(video.origin_cover),
      ...imageValues(video.dynamic_cover),
      ...meta.images,
    ]),
    strategy: state && aweme ? 'douyin-render-data' : 'douyin-metadata',
    status: /验证码|verify|captcha|登录/i.test(meta.title + text.slice(0, 5000))
      ? 'login_required'
      : state && aweme ? 'ok' : 'partial',
  }, finalTarget, requestUrl);
}

async function extractThreads(target, requestUrl) {
  const { response, text } = await fetchText(target, { referer: 'https://www.threads.net/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const textValue = decodeJsString(text.match(/"text_post_app_info"[\s\S]{0,3000}?"text"\s*:\s*"([^"]+)"/i)?.[1] || '');
  const displayUrls = [...text.matchAll(/"display_url"\s*:\s*"([^"]+)"/g)]
    .map(match => decodeJsString(match[1]).replace(/\\u0026/g, '&').replace(/\\\//g, '/'));
  return finalResult({
    ...meta,
    description: firstValue(textValue, meta.description),
    images: unique([...displayUrls, ...meta.images]),
    strategy: 'threads-page-state',
    status: /login|log in|登录/i.test(meta.title) ? 'login_required' : 'ok',
  }, finalTarget, requestUrl);
}

async function extractEmbedOrMetadata(target, requestUrl, strategy) {
  const { response, text } = await fetchText(target);
  const finalTarget = safeUrl(response.url) || target;
  const data = parseMeta(text, finalTarget);
  data.strategy = strategy;
  if (/login|登录|安全验证|captcha|verify/i.test(data.title)) data.status = 'login_required';
  return finalResult(data, finalTarget, requestUrl);
}

async function extractGeneric(target, requestUrl, strategy = 'html-metadata') {
  const { response, text } = await fetchText(target);
  const finalTarget = safeUrl(response.url) || target;
  const data = parseMeta(text, finalTarget);
  data.strategy = strategy;
  if (/Sina Visitor System/i.test(data.title) || /登录.*小红书|安全验证|verify/i.test(data.title)) data.status = 'login_required';
  return finalResult(data, finalTarget, requestUrl);
}

async function extract(target, requestUrl) {
  const { platform } = platformFor(target);
  if (platform === 'x') return extractX(target, requestUrl);
  if (platform === 'weibo') return extractWeibo(target, requestUrl);
  if (platform === 'wechat') return extractWechat(target, requestUrl);
  if (platform === 'zhihu') return extractZhihu(target, requestUrl);
  if (platform === 'xiaohongshu') return extractXiaohongshu(target, requestUrl);
  if (platform === 'jike') return extractJike(target, requestUrl);
  if (platform === 'netease_music') return extractNeteaseMusic(target, requestUrl);
  if (platform === 'qq_music') return extractQQMusic(target, requestUrl);
  if (platform === 'telegram') return extractTelegram(target, requestUrl);
  if (platform === 'spotify') return extractSpotify(target, requestUrl);
  if (platform === 'instagram') {
    try { return await extractInstagram(target, requestUrl); }
    catch { return finalResult({ title: 'Instagram', strategy: 'instagram-login-wall', status: 'login_required' }, target, requestUrl); }
  }
  if (platform === 'threads') {
    try { return await extractThreads(target, requestUrl); }
    catch { return finalResult({ title: 'Threads', strategy: 'threads-restricted', status: 'login_required' }, target, requestUrl); }
  }
  if (platform === 'douban') return extractDouban(target, requestUrl);
  if (platform === 'douyin') return extractDouyin(target, requestUrl);
  if (platform === 'chatgpt' || platform === 'kimi') {
    try { return await extractEmbedOrMetadata(target, requestUrl, platform + '-shared-page'); }
    catch { return finalResult({ title: platform === 'chatgpt' ? 'ChatGPT 分享' : 'Kimi 分享', strategy: platform + '-restricted', status: 'login_required' }, target, requestUrl); }
  }
  const strategies = { apple_music: 'applemusic-structured-metadata' };
  return extractEmbedOrMetadata(target, requestUrl, strategies[platform] || 'html-metadata');
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
            referer: imageReferer(target),
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
