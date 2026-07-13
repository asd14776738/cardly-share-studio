const files = __FILES__;

const PLATFORM_RULES = [
  ['x', 'X', h => h === 'x.com' || h === 'twitter.com' || h.endsWith('.twitter.com')],
  ['weibo', '微博', h => h === 'weibo.com' || h.endsWith('.weibo.com') || h === 'weibo.cn' || h.endsWith('.weibo.cn')],
  ['wechat', '微信公众号', h => h === 'mp.weixin.qq.com'],
  ['zhihu', '知乎', h => h === 'zhihu.com' || h.endsWith('.zhihu.com')],
  ['xiaohongshu', '小红书', h => h === 'xiaohongshu.com' || h.endsWith('.xiaohongshu.com') || h === 'xhslink.com'],
  ['jike', '即刻', h => h === 'okjike.com' || h.endsWith('.okjike.com')],
  ['instagram', 'Instagram', h => h === 'instagram.com' || h.endsWith('.instagram.com')],
  ['threads', 'Threads', h => h === 'threads.net' || h.endsWith('.threads.net') || h === 'threads.com' || h.endsWith('.threads.com')],
  ['douban', '豆瓣', h => h === 'douban.com' || h.endsWith('.douban.com')],
  ['telegram', 'Telegram', h => h === 't.me' || h === 'telegram.me'],
  ['douyin', '抖音', h => h === 'douyin.com' || h.endsWith('.douyin.com') || h === 'v.douyin.com'],
  ['netease_music', '网易云音乐', h => h === 'music.163.com' || h.endsWith('.music.163.com') || h === '163cn.tv' || h.endsWith('.163cn.tv')],
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

function readingStats(value) {
  const text = textOnly(value);
  const hanCharacters = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const latinWords = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  const minutes = Math.max(1, Math.ceil(hanCharacters / 300 + latinWords / 220));
  return { readingMinutes: minutes, readingUnits: hanCharacters + latinWords };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function mediaKey(value) {
  const decoded = decode(value);
  const parsed = safeUrl(decoded);
  if (!parsed) return decoded;
  const host = parsed.hostname.toLowerCase().replace(/^sns-webpic-[^.]+\./, '');
  if (host.endsWith('xhscdn.com')) {
    return host + parsed.pathname.replace(/![^/]+$/, '');
  }
  for (const key of ['imageView2', 'imageMogr2', 'x-oss-process', 'x-image-process', 'w', 'h', 'width', 'height', 'q', 'quality', 'format']) {
    parsed.searchParams.delete(key);
  }
  parsed.hash = '';
  return parsed.toString();
}

function uniqueMedia(values) {
  const seen = new Set();
  return values.filter(Boolean).filter(value => {
    const key = mediaKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

function parseJsonScripts(html) {
  const values = [];
  for (const script of html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || []) {
    const raw = script.replace(/^.*?>/s, '').replace(/<\/script>$/i, '').trim();
    if (!raw || (!raw.startsWith('{') && !raw.startsWith('['))) continue;
    try { values.push(JSON.parse(decode(raw))); }
    catch { try { values.push(JSON.parse(raw)); } catch {} }
  }
  return values;
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
  if (host.includes('cdninstagram.com') || host.includes('fbcdn.net')) return 'https://www.instagram.com/';
  if (host.includes('doubanio.com')) return 'https://www.douban.com/';
  if (host.includes('douyinpic.com') || host.includes('douyincdn.com')) return 'https://www.douyin.com/';
  return target.origin + '/';
}

function finalResult(data, target, requestUrl) {
  const base = platformFor(target);
  const directImages = uniqueMedia((data.images || []).map(value => {
    const decoded = decode(value);
    return decoded ? safeUrl(decoded, target)?.toString() || '' : '';
  }));
  const images = directImages.map(value => proxied(value, requestUrl)).filter(Boolean).slice(0, 12);
  const title = textOnly(data.title);
  const description = textOnly(data.description).replace(/https:\/\/t\.co\/\w+\s*$/i, '').trim();
  const reading = readingStats(firstValue(data.readingText, description));
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
    ...reading,
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
    const endpoints = [
      new URL('https://weibo.com/ajax/statuses/show?id=' + encodeURIComponent(id)),
      new URL('https://m.weibo.cn/statuses/show?id=' + encodeURIComponent(id)),
    ];
    for (const endpoint of endpoints) {
      try {
        const payload = await fetchJson(endpoint, {
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
          referer: target.toString(),
          'x-requested-with': 'XMLHttpRequest',
        });
        const post = payload?.data || payload;
        if (!post || !(post.text_raw || post.text || post.user)) continue;
        const pictureObjects = post.pic_infos ? Object.values(post.pic_infos) : post.pics || [];
        const pictures = pictureObjects.flatMap(item =>
          imageValues(item?.largest || item?.large || item?.original || item)
        );
        return finalResult({
          title: post.user?.screen_name ? post.user.screen_name + ' \u7684\u5fae\u535a' : '\u5fae\u535a',
          description: post.text_raw || post.text || '',
          author: post.user?.screen_name || '',
          images: uniqueMedia([...pictures, ...imageValues(post.page_info?.page_pic)]),
          strategy: endpoint.hostname.startsWith('m.') ? 'weibo-mobile-json' : 'weibo-public-json',
        }, target, requestUrl);
      } catch {}
    }
  }

  let text = '';
  let finalTarget = target;
  try {
    const page = await fetchText(target);
    text = page.text;
    finalTarget = safeUrl(page.response.url) || target;
  } catch {}
  const meta = parseMeta(text, finalTarget);
  const renderData = parseJsonBlock(text, /\$render_data\s*=\s*([\s\S]*?)<\/script>/i);
  const renderedPost = findBestObject(renderData, value => {
    let score = 0;
    if (value?.user?.screen_name) score += 3;
    if (value?.text || value?.text_raw) score += 5;
    if (value?.id || value?.mid) score += 2;
    return score;
  });
  if (renderedPost) {
    return finalResult({
      title: renderedPost.user?.screen_name ? renderedPost.user.screen_name + ' \u7684\u5fae\u535a' : meta.title,
      description: firstValue(renderedPost.text_raw, renderedPost.text, meta.description),
      author: firstValue(renderedPost.user?.screen_name, meta.author),
      images: uniqueMedia([
        ...imageValues(renderedPost.pics),
        ...imageValues(renderedPost.pic_infos && Object.values(renderedPost.pic_infos)),
        ...meta.images,
      ]),
      strategy: 'weibo-render-data',
    }, finalTarget, requestUrl);
  }

  const blocked = /Sina Visitor System|passport\.weibo\.com|\u767b\u5f55|login/i.test(text);
  const hasMeta = Boolean(meta.description || meta.images.length || (meta.title && !/\u5fae\u535a|weibo/i.test(meta.title)));
  return finalResult({
    ...meta,
    title: firstValue(meta.title, '\u5fae\u535a'),
    strategy: blocked ? 'weibo-login-wall' : 'weibo-metadata',
    status: blocked && !hasMeta ? 'login_required' : hasMeta ? 'partial' : 'login_required',
  }, finalTarget, requestUrl);
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
    readingText: contentText,
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
  const targetNoteId = finalTarget.pathname.match(/\/(?:discovery\/item|explore)\/([^/?]+)/i)?.[1] ||
    target.pathname.match(/\/(?:discovery\/item|explore)\/([^/?]+)/i)?.[1] || '';
  const note = findBestObject(state, value => {
    const candidateId = String(value?.noteId || value?.note_id || value?.id || '');
    if (targetNoteId && candidateId && candidateId !== targetNoteId) return 0;
    let score = 0;
    if (targetNoteId && candidateId === targetNoteId) score += 12;
    if (typeof value.desc === 'string' || typeof value.noteId === 'string' || typeof value.note_id === 'string') score += 4;
    if (Array.isArray(value.imageList) || Array.isArray(value.images)) score += 4;
    if (value.user?.nickname || value.user?.nickName) score += 2;
    if (typeof value.title === 'string') score += 1;
    return score;
  });
  const isNote = Boolean(note && (note.noteId || note.note_id || typeof note.desc === 'string' || Array.isArray(note.imageList)));
  const noteMedia = uniqueMedia([
    ...imageValues(note?.imageList),
    ...imageValues(note?.images),
  ]);
  const media = noteMedia.length
    ? noteMedia
    : uniqueMedia([...imageValues(note?.cover), ...meta.images]);
  const blocked = /\u767b\u5f55|\u5b89\u5168\u9a8c\u8bc1|verify|captcha/i.test(meta.title + text.slice(0, 5000)) ||
    (!isNote && !meta.description && /\u5c0f\u7ea2\u4e66|ICP/i.test(meta.title));
  return finalResult({
    title: firstValue(note?.title, note?.displayTitle, meta.title),
    description: firstValue(note?.desc, note?.description, meta.description),
    author: firstValue(note?.user?.nickname, note?.user?.nickName, note?.user?.name, meta.author),
    images: media,
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
  const channel = parts[0] === 's' ? parts[1] : parts[0];
  const postId = parts[0] === 's' ? parts[2] : parts[1];
  if (channel && postId) {
    const embed = new URL('https://t.me/' + channel + '/' + postId);
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
  const mediaPath = target.pathname.match(/\/(p|reel|tv)\/([^/]+)/i);
  const mediaType = mediaPath?.[1]?.toLowerCase();
  const code = mediaPath?.[2];
  const scorePost = value => {
    const candidateCode = value?.shortcode || value?.code;
    if (code && candidateCode && candidateCode !== code) return 0;
    let score = 0;
    if (code && candidateCode === code) score += 12;
    if (value.edge_media_to_caption || value.caption?.text) score += 4;
    if (value.owner?.username || value.user?.username) score += 2;
    if (value.display_url || value.carousel_media || value.edge_sidecar_to_children) score += 3;
    return score;
  };
  const sources = code
    ? [
        new URL('https://www.instagram.com/' + mediaType + '/' + code + '/embed/captioned/'),
        new URL('https://www.instagram.com/' + mediaType + '/' + code + '/embed/'),
        target,
      ]
    : [target];
  let text = '';
  let meta = { title: '', description: '', author: '', images: [] };
  let states = [];
  let post = null;

  for (const source of sources) {
    try {
      const page = await fetchText(source, {
        referer: 'https://www.instagram.com/',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      });
      text += '\n' + page.text;
      const nextMeta = parseMeta(page.text, source);
      if (!meta.description && nextMeta.description) meta = nextMeta;
      else meta.images = uniqueMedia([...(meta.images || []), ...(nextMeta.images || [])]);
      states.push(...parseJsonScripts(page.text));
      post = findBestObject(states, scorePost);
      if (post && (post.caption?.text || post.edge_media_to_caption || post.display_url || post.carousel_media)) break;
    } catch {}
  }

  if (!post && code) {
    try {
      const jsonUrl = new URL(target);
      jsonUrl.searchParams.set('__a', '1');
      jsonUrl.searchParams.set('__d', 'dis');
      const json = await fetchJson(jsonUrl, {
        referer: target.toString(),
        'x-ig-app-id': '936619743392459',
      });
      states.push(json);
      post = findBestObject(states, scorePost);
    } catch {}
  }

  const edges = post?.edge_sidecar_to_children?.edges || [];
  const mediaItems = [post, ...edges.map(edge => edge?.node), ...(post?.carousel_media || [])].filter(Boolean);
  const media = uniqueMedia(mediaItems.flatMap(item => [
    item.display_url,
    item.thumbnail_src,
    ...imageValues(item.image_versions2?.candidates),
  ]));
  const rawCaption = firstValue(
    post?.caption?.text,
    post?.edge_media_to_caption?.edges?.[0]?.node?.text,
    text.match(/<div[^>]+class=["'][^"']*(?:Caption|caption)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1],
    meta.description,
  );
  const generic = value => /^(?:Instagram|Log in|Sign up)\s*$|create an account|see photos and videos/i.test(textOnly(value));
  const caption = generic(rawCaption) ? '' : rawCaption;
  const author = firstValue(post?.owner?.username, post?.user?.username, meta.author);
  const hasPublicContent = Boolean(caption || media.length || meta.images.length);
  return finalResult({
    title: firstValue(author && '@' + author + ' on Instagram', meta.title),
    description: caption,
    author,
    images: uniqueMedia([...media, ...meta.images]),
    strategy: post ? 'instagram-json-state' : code ? 'instagram-embed' : 'instagram-page',
    status: hasPublicContent
      ? (post ? 'ok' : 'partial')
      : /login|log in|\u767b\u5f55|sign up/i.test(meta.title + text.slice(0, 8000)) ? 'login_required' : 'partial',
  }, target, requestUrl);
}
async function extractDouban(target, requestUrl) {
  const id = target.pathname.match(/\/subject\/(\d+)/)?.[1];
  if (id) {
    try {
      const host = target.hostname.toLowerCase();
      const type = host.startsWith('book.') || /\/book\//i.test(target.pathname)
        ? 'book'
        : host.startsWith('music.') || /\/music\//i.test(target.pathname) ? 'music' : 'movie';
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
  let finalTarget = safeUrl(response.url) || target;
  let meta = parseMeta(text, finalTarget);
  const raw = text.match(/<script[^>]+id=["']RENDER_DATA["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  let state = null;
  let strategy = 'douyin-metadata';
  if (raw) {
    try {
      state = JSON.parse(decodeURIComponent(decode(raw)));
      strategy = 'douyin-render-data';
    } catch {}
  }
  const scoreAweme = value => {
    let score = 0;
    if (value.aweme_id || value.awemeId) score += 4;
    if (typeof value.desc === 'string') score += 3;
    if (value.video || value.images) score += 3;
    if (value.author?.nickname) score += 2;
    return score;
  };
  let aweme = findBestObject(state, scoreAweme);
  const videoId = finalTarget.pathname.match(/\/(?:video|share\/video)\/(\d+)/i)?.[1] ||
    target.pathname.match(/\/(?:video|share\/video)\/(\d+)/i)?.[1];
  const awemeId = value => String(value?.aweme_id || value?.awemeId || '');
  const isRealAweme = value => Boolean(value) && scoreAweme(value) >= 8 &&
    Boolean(value.author?.nickname || value.video || value.images) &&
    (!videoId || !awemeId(value) || awemeId(value) === videoId);
  if (!isRealAweme(aweme)) aweme = null;
  let restrictedReason = '';
  if (!aweme && videoId) {
    try {
      const share = new URL('https://www.iesdouyin.com/share/video/' + videoId + '/');
      const mobile = await fetchText(share, {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
        referer: 'https://www.douyin.com/',
      });
      const router = parseJsonBlock(
        mobile.text,
        /window\._ROUTER_DATA\s*=\s*([\s\S]*?)<\/script>/i,
      );
      const shareAweme = findBestObject(router, scoreAweme);
      const restriction = findBestObject(router, value => typeof value?.filter_reason === 'string' ? 20 : 0);
      restrictedReason = restriction?.filter_reason || '';
      if (isRealAweme(shareAweme)) {
        state = router;
        aweme = shareAweme;
        strategy = 'douyin-share-router-data';
        const shareTarget = safeUrl(mobile.response.url) || finalTarget;
        meta = parseMeta(mobile.text, shareTarget);
      }
    } catch {}
  }
  const video = aweme?.video || {};
  const logicalImages = value => {
    const items = Array.isArray(value) ? value : value ? [value] : [];
    return uniqueMedia(items.map(item => imageValues(item)[0]).filter(Boolean));
  };
  const imagePostMedia = logicalImages(aweme?.images);
  const videoCover = firstValue(
    imageValues(video.origin_cover)[0],
    imageValues(video.cover)[0],
    imageValues(video.dynamic_cover)[0],
    meta.images[0],
  );
  const media = restrictedReason
    ? []
    : imagePostMedia.length
      ? imagePostMedia
      : videoCover ? [videoCover] : [];
  return finalResult({
    title: restrictedReason ? '抖音作品暂不可访问' : firstValue(aweme?.desc, meta.title),
    description: restrictedReason ? '' : firstValue(aweme?.desc, meta.description),
    author: firstValue(aweme?.author?.nickname, aweme?.author?.unique_id, meta.author),
    images: media,
    strategy: restrictedReason ? 'douyin-restricted' : strategy,
    status: restrictedReason
      ? 'unavailable'
      : /\u9a8c\u8bc1\u7801|verify|captcha|\u767b\u5f55/i.test(meta.title + text.slice(0, 5000))
        ? 'login_required'
        : state && aweme ? 'ok' : 'partial',
  }, finalTarget, requestUrl);
}

async function extractThreads(target, requestUrl) {
  const { response, text } = await fetchText(target, { referer: 'https://www.threads.com/' });
  const finalTarget = safeUrl(response.url) || target;
  const meta = parseMeta(text, finalTarget);
  const code = finalTarget.pathname.match(/\/(?:post|t)\/([^/?]+)/i)?.[1] || target.pathname.match(/\/(?:post|t)\/([^/?]+)/i)?.[1];
  const states = parseJsonScripts(text);
  const post = findBestObject(states, value => {
    let score = 0;
    if (code && value.code === code) score += 12;
    if (value.text_post_app_info) score += 4;
    if (value.caption?.text || typeof value.text === 'string') score += 4;
    if (value.user?.username || value.user?.full_name) score += 2;
    if (value.image_versions2 || value.carousel_media || value.video_versions) score += 2;
    return score;
  });
  const fragments = post?.text_post_app_info?.text_fragments;
  const fragmentText = Array.isArray(fragments)
    ? fragments.map(item => firstValue(item?.text, item?.plaintext, item?.link?.text)).filter(Boolean).join('')
    : '';
  const postText = firstValue(post?.caption?.text, post?.text, fragmentText);
  const mediaItems = [post, ...(Array.isArray(post?.carousel_media) ? post.carousel_media : [])].filter(Boolean);
  const media = unique(mediaItems.flatMap(item => [
    item.display_url,
    item.thumbnail_url,
    ...imageValues(item.image_versions2?.candidates),
    ...imageValues(item.image_versions2),
  ]));
  const author = firstValue(post?.user?.username, post?.user?.full_name);
  const hasPublicContent = Boolean(postText || media.length || meta.description || meta.images.length);
  return finalResult({
    title: firstValue(author && '@' + author + ' on Threads', meta.title),
    description: firstValue(postText, meta.description),
    author,
    images: unique([...media, ...meta.images]),
    strategy: post ? 'threads-json-state' : 'threads-page-state',
    status: /login|log in|登录/i.test(meta.title)
      ? 'login_required'
      : hasPublicContent ? 'ok' : 'partial',
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
