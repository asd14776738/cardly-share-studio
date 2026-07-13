import { estimateReadingMinutes, buildKicker } from './reading-time.js';

const platformIcons = {
  x: 'https://cdn.simpleicons.org/x/111111',
  weibo: 'https://cdn.simpleicons.org/sinaweibo/E6162D',
  telegram: 'https://cdn.simpleicons.org/telegram/26A5E4',
  instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
  zhihu: 'https://cdn.simpleicons.org/zhihu/1772F6',
  wechat: 'https://cdn.simpleicons.org/wechat/07C160',
  xiaohongshu: 'https://cdn.simpleicons.org/xiaohongshu/FF2442',
  jike: 'https://www.google.com/s2/favicons?domain=web.okjike.com&sz=64',
  netease: 'https://cdn.simpleicons.org/neteasecloudmusic/E60026',
  qqmusic: 'https://www.google.com/s2/favicons?domain=y.qq.com&sz=64',
  douban: 'https://cdn.simpleicons.org/douban/2D963D',
  douyin: 'https://cdn.simpleicons.org/tiktok/111111',
  spotify: 'https://cdn.simpleicons.org/spotify/1ED760',
  apple: 'https://cdn.simpleicons.org/applemusic/FA243C',
  threads: 'https://cdn.simpleicons.org/threads/111111',
  chatgpt: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64',
  kimi: 'https://www.google.com/s2/favicons?domain=kimi.com&sz=64'
};

function iconForUrl(value) {
  const parsed = new URL(value);
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'x.com' || host === 'twitter.com') return platformIcons.x;
  if (host === 'weibo.com' || host.endsWith('.weibo.com') || host === 'weibo.cn' || host.endsWith('.weibo.cn')) return platformIcons.weibo;
  if (host === 't.me' || host === 'telegram.org') return platformIcons.telegram;
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) return platformIcons.instagram;
  if (host === 'zhihu.com' || host.endsWith('.zhihu.com')) return platformIcons.zhihu;
  if (host === 'mp.weixin.qq.com') return platformIcons.wechat;
  if (host === 'xiaohongshu.com' || host.endsWith('.xiaohongshu.com') || host === 'xhslink.com') return platformIcons.xiaohongshu;
  if (host === 'okjike.com' || host.endsWith('.okjike.com')) return platformIcons.jike;
  if (host === 'music.163.com' || host.endsWith('.music.163.com') || host === '163cn.tv' || host.endsWith('.163cn.tv')) return platformIcons.netease;
  if (host === 'y.qq.com' || host.endsWith('.y.qq.com')) return platformIcons.qqmusic;
  if (host === 'douban.com' || host.endsWith('.douban.com')) return platformIcons.douban;
  if (host === 'douyin.com' || host.endsWith('.douyin.com') || host === 'v.douyin.com') return platformIcons.douyin;
  if (host === 'open.spotify.com') return platformIcons.spotify;
  if (host === 'music.apple.com') return platformIcons.apple;
  if (host === 'threads.com' || host.endsWith('.threads.com') || host === 'threads.net' || host.endsWith('.threads.net')) return platformIcons.threads;
  if (host === 'chatgpt.com' || host === 'chat.openai.com') return platformIcons.chatgpt;
  if (host === 'kimi.com' || host.endsWith('.kimi.com') || host === 'kimi.moonshot.cn') return platformIcons.kimi;
  return new URL('/favicon.ico', parsed.origin).href;
}

const defaults = {
  source: 'web',
  platform: 'web',
  contentStatus: 'ok',
  readingMinutes: null,
  colorMode: 'auto',
  sourceLabel: 'ARCHDAILY.CN',
  ratio: 'auto',
  layout: 'editorial',
  theme: 'coastal',
  font: 'sans',
  radius: 18,
  padding: 32,
  url: 'https://www.archdaily.cn/cn/1012043',
  title: '在海风与山影之间，重新想象公共空间',
  description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
  author: 'ARCHDAILY.CN',
  image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=88'
};

defaults.images = [defaults.image];

defaults.icon = iconForUrl(defaults.url);

const sourceData = {
  web: {
    hint: '支持文章、作品集、产品页等公开网页',
    placeholder: 'https://example.com/article',
    name: 'ARCHDAILY.CN', icon: '⌁', iconUrl: defaults.icon, kicker: 'ARCHITECTURE · 6 MIN READ',
    title: '在海风与山影之间，重新想象公共空间',
    description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
    image: defaults.image
  },
  weibo: {
    hint: '支持微博正文、图集和整段分享口令；受限内容可继续手动编辑',
    placeholder: 'https://weibo.com/user/status 或粘贴整段分享文案',
    name: '微博', icon: '微', iconUrl: iconForUrl('https://weibo.com'),
    title: '今天也想记录一点值得留住的事。',
    description: '粘贴公开微博链接，Cardly 会提取正文、作者与图片；若平台限制匿名读取，仍可手动补全。',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=88'
  },
  xiaohongshu: {
    hint: '支持小红书公开笔记与 xhslink 短链',
    placeholder: 'https://www.xiaohongshu.com/discovery/item/…',
    name: '小红书', icon: 'RED', iconUrl: iconForUrl('https://www.xiaohongshu.com'),
    title: '週末，在城市里收集光影。',
    description: '穿过旧街区，玻璃、树影和晾晒的衣服让平常的一天有了电影感。',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=88'
  },
  douyin: {
    hint: '支持抖音视频长链、v.douyin.com 短链与整段分享口令',
    placeholder: 'https://v.douyin.com/… 或粘贴整段分享文案',
    name: '抖音', icon: '♪', iconUrl: iconForUrl('https://www.douyin.com'),
    title: '把一瞬间，留成一张值得分享的卡片。',
    description: '公开作品会自动提取标题、作者与封面；已下架或受限作品会清楚提示，不再显示错误内容。',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=88'
  },
  telegram: {
    hint: '粘贴公开频道或公开消息链接',
    placeholder: 'https://t.me/channel/123',
    name: 'TELEGRAM · @FUTURESPACE', icon: '↗', iconUrl: iconForUrl('https://t.me'), kicker: 'CHANNEL POST · 2 HOURS AGO',
    title: '城市不是建成的，它每天都在被重新协商。',
    description: '从街角座椅到夜间照明，微小的公共决策正在改变我们感受城市的方式。',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=88'
  },
  x: {
    hint: '粘贴公开帖子链接，自动提取作者和正文',
    placeholder: 'https://x.com/user/status/…',
    name: 'X · @DESIGNNOTES', icon: '𝕏', iconUrl: iconForUrl('https://x.com'), kicker: 'POST · JUL 11, 2026',
    title: 'Good design makes complexity feel inevitable.',
    description: 'The best interfaces do not remove depth. They give it rhythm, hierarchy and a human pace.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=88'
  },
  instagram: {
    hint: '粘贴公开帖子或 Reel 链接',
    placeholder: 'https://www.instagram.com/p/…',
    name: 'INSTAGRAM · @SLOW.WEEKEND', icon: '◎', iconUrl: iconForUrl('https://www.instagram.com'), kicker: 'PHOTO · SHANGHAI',
    title: '週末，在城市里收集光影。',
    description: '穿过旧街区，玻璃、树影和晾晒的衣服让平常的一天有了电影感。',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=88'
  }
};

const themeConfig = {
  coastal: { name: '海盐', stops: ['#a9dfe8','#eaf1ea','#efc8b5'], surface: 'rgba(255,255,255,.82)', text: '#171b20', dark: false },
  ink: { name: '墨夜', stops: ['#11151c','#313b4a','#657080'], surface: 'rgba(13,17,24,.80)', text: '#ffffff', dark: true },
  paper: { name: '暖纸', stops: ['#d8c39e','#eee4cf','#fbf7ed'], surface: 'rgba(255,252,244,.84)', text: '#27231d', dark: false },
  film: { name: '胶片', stops: ['#756a58','#b6a582','#d9d2c1'], surface: 'rgba(248,243,232,.78)', text: '#26241f', dark: false },
  berry: { name: '莓果', stops: ['#571536','#a94968','#e6acac'], surface: 'rgba(52,12,31,.76)', text: '#ffffff', dark: true },
  jade: { name: '青岚', stops: ['#245b59','#75a197','#dce7d3'], surface: 'rgba(240,247,240,.80)', text: '#17302f', dark: false },
  sky: { name: '天光', stops: ['#6eb2e5','#b9dcf3','#eaf7fb'], surface: 'rgba(255,255,255,.82)', text: '#172a3d', dark: false },
  lilac: { name: '鸢尾', stops: ['#806ab7','#c4b5df','#eee9f7'], surface: 'rgba(250,248,255,.80)', text: '#27213b', dark: false },
  sunrise: { name: '晨曦', stops: ['#f27d62','#f8b88a','#ffe3b4'], surface: 'rgba(255,250,242,.82)', text: '#342018', dark: false },
  moss: { name: '苔原', stops: ['#314a39','#6f8659','#b4bd88'], surface: 'rgba(27,43,31,.76)', text: '#ffffff', dark: true },
  sand: { name: '沙丘', stops: ['#a77c50','#cda878','#ead7b0'], surface: 'rgba(255,249,236,.80)', text: '#34271b', dark: false },
  slate: { name: '岩灰', stops: ['#3e4651','#7c8792','#cbd0d5'], surface: 'rgba(24,29,35,.76)', text: '#ffffff', dark: true },
  coral: { name: '珊瑚', stops: ['#de574f','#f58d78','#ffd1bd'], surface: 'rgba(255,248,242,.82)', text: '#3a1e1a', dark: false },
  cobalt: { name: '钴蓝', stops: ['#1748cc','#4f7ee4','#a5c1fa'], surface: 'rgba(13,34,91,.76)', text: '#ffffff', dark: true },
  lime: { name: '青柠', stops: ['#9fbd39','#cbdc72','#edf3b2'], surface: 'rgba(252,255,239,.82)', text: '#25300f', dark: false },
  midnight: { name: '午夜', stops: ['#06182d','#253d70','#8d5d79'], surface: 'rgba(4,13,29,.78)', text: '#ffffff', dark: true },
  rose: { name: '蔷薇', stops: ['#a53e60','#d6788f','#f1becb'], surface: 'rgba(255,246,249,.80)', text: '#371724', dark: false },
  mono: { name: '黑白', stops: ['#0a0a0a','#767676','#eeeeee'], surface: 'rgba(255,255,255,.86)', text: '#111111', dark: false },
};

const state = { ...defaults, images: [...defaults.images] };
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];
const card = qs('#share-card');
const titleInput = qs('#card-title');
const descriptionInput = qs('#card-description');
const urlInput = qs('#source-url');
const authorInput = qs('#card-author');

function showToast(message) {
  const toast = qs('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function extractUrlFromShare(value) {
  const match = String(value || '').match(/https?:\/\/[^\s<>"'，。]+/i);
  return match ? match[0].replace(/[)\]】）]+$/, '') : '';
}

const semanticPalettes = [
  { test: /海|湖|雨|天空|蓝|旅行|岛|风景|ocean|sea|sky|travel/i, hue: 198, name: '海岸蓝' },
  { test: /树|森林|植物|花园|自然|春|露营|green|nature|forest/i, hue: 142, name: '林间绿' },
  { test: /食|餐|咖啡|烘焙|甜|火锅|晚餐|food|coffee|cake/i, hue: 28, name: '烟火橙' },
  { test: /爱|浪漫|花|温柔|婚礼|rose|love|romance/i, hue: 346, name: '花影粉' },
  { test: /科技|AI|代码|产品|数字|未来|design|tech|code/i, hue: 224, name: '数码蓝' },
  { test: /艺术|展览|电影|摄影|音乐|书|诗|art|film|music|book/i, hue: 278, name: '艺文紫' },
  { test: /复古|历史|建筑|城市|街道|胶片|vintage|architecture/i, hue: 38, name: '旧城金' },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function textHash(value) {
  let hash = 2166136261;
  for (const char of String(value || '')) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hsl(hue, saturation, lightness) {
  const normalized = ((Math.round(hue) % 360) + 360) % 360;
  return `hsl(${normalized} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
}

function rgbToHsl(red, green, blue) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = lightness > .5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
  }
  return { hue, saturation: saturation * 100, lightness: lightness * 100 };
}

function paletteForContent() {
  const text = `${state.title || ''} ${state.description || ''}`.trim();
  const rule = semanticPalettes.find(item => item.test.test(text));
  const hash = textHash(text || state.url || state.platform);
  const sampled = state.imageColor;
  const hue = sampled && sampled.saturation > 12
    ? sampled.hue
    : rule ? rule.hue + ((hash % 17) - 8) : hash % 360;
  const saturation = clamp(sampled?.saturation || (rule ? 48 : 38), 30, 64);
  const isDark = /夜|黑|深夜|宇宙|星空|霓虹|night|dark|space/i.test(text);
  const warmShift = /温暖|阳光|夏|秋|美食|咖啡|sun|warm/i.test(text) ? 12 : 0;
  const baseHue = hue + warmShift;
  const stops = isDark
    ? [
        hsl(baseHue, saturation * .72, 15),
        hsl(baseHue + 20, saturation * .58, 27),
        hsl(baseHue - 28, saturation * .5, 44),
      ]
    : [
        hsl(baseHue, saturation * .72, 77),
        hsl(baseHue + 22, saturation * .48, 91),
        hsl(baseHue - 34, saturation * .62, 84),
      ];
  const reason = sampled && sampled.saturation > 12
    ? '取自正文图片与文字'
    : rule ? `识别到“${rule.name}”语义` : '根据正文实时生成';
  return {
    name: rule?.name || '内容色谱',
    stops,
    surface: isDark ? 'rgba(15,18,23,.82)' : 'rgba(255,255,255,.86)',
    text: isDark ? '#f7f7f4' : '#1b1d20',
    dark: isDark,
    reason,
  };
}

function syncPalettePreview(palette) {
  const paletteBars = qsa('#auto-palette i');
  [...palette.stops, palette.text].forEach((color, index) => {
    if (paletteBars[index]) paletteBars[index].style.background = color;
  });
  const label = qs('#recommend-label');
  if (label) label.textContent = `自动开启 · ${palette.reason}`;
}

function refreshContentPalette() {
  state.dynamicTheme = paletteForContent();
  state.recommendedTheme = 'dynamic';
  if (state.colorMode !== 'manual') {
    state.colorMode = 'auto';
    state.theme = 'dynamic';
  }
  syncPalettePreview(state.dynamicTheme);
  qsa('.theme-swatch').forEach(item => item.classList.toggle('active', state.colorMode === 'manual' && item.dataset.theme === state.theme));
  if (card) updateCard();
}

let paletteTimer = null;
function schedulePaletteRefresh() {
  clearTimeout(paletteTimer);
  paletteTimer = setTimeout(refreshContentPalette, 90);
}

function sampleImagePalette(image, src) {
  if (state.sampledImageSrc === src) return;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let red = 0;
    let green = 0;
    let blue = 0;
    let weight = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 180) continue;
      const sum = pixels[index] + pixels[index + 1] + pixels[index + 2];
      if (sum > 735 || sum < 24) continue;
      const max = Math.max(pixels[index], pixels[index + 1], pixels[index + 2]);
      const min = Math.min(pixels[index], pixels[index + 1], pixels[index + 2]);
      const chroma = Math.max(12, max - min);
      red += pixels[index] * chroma;
      green += pixels[index + 1] * chroma;
      blue += pixels[index + 2] * chroma;
      weight += chroma;
    }
    if (!weight) return;
    state.sampledImageSrc = src;
    state.imageColor = rgbToHsl(red / weight, green / weight, blue / weight);
    refreshContentPalette();
  } catch {
    state.sampledImageSrc = src;
  }
}

function setRecommendedTheme() {
  state.colorMode = 'auto';
  refreshContentPalette();
}
function titleRole(text) {
  return /(\(@[^)]+\)|\bon\s+X$|^@\w+)/i.test(String(text || '').trim()) ? 'publisher' : 'headline';
}

function contentDensity(text) {
  const length = String(text || '').trim().length;
  if (length <= 90) return 'short';
  if (length <= 320) return 'medium';
  return 'long';
}

function liveKicker() {
  return buildKicker({
    platform: state.platform || state.source || 'web',
    status: state.contentStatus,
    readingMinutes: state.readingMinutes,
    description: state.description,
    imageCount: (state.images || []).filter(Boolean).length,
  });
}

function renderMediaGallery() {
  const gallery = qs('#media-gallery');
  const images = (state.images || []).filter(Boolean).slice(0, 6);
  gallery.className = `media-gallery media-count-${Math.min(images.length, 4)}`;
  gallery.replaceChildren();
  if (!images.length) return;
  let tallCount = 0;
  images.forEach((src, index) => {
    const image = document.createElement('img');
    image.crossOrigin = src.startsWith('data:') ? null : 'anonymous';
    image.src = src;
    image.alt = `内容图片 ${index + 1}`;
    image.addEventListener('load', () => {
      if (image.naturalHeight / image.naturalWidth > 1.25) tallCount += 1;
      gallery.classList.toggle('is-tall', tallCount > 0);
      if (index === 0 && state.colorMode === 'auto') sampleImagePalette(image, src);
    }, { once: true });
    gallery.appendChild(image);
  });
}

function updateCard() {
  const density = contentDensity(state.description);
  const content = canvasContent();
  const role = titleRole(content.title);
  const mediaState = (state.images || []).some(Boolean) ? 'has-media' : 'no-media';
  const theme = state.theme === 'dynamic'
    ? state.dynamicTheme || paletteForContent()
    : themeConfig[state.theme] || themeConfig.coastal;
  const cleanTitle = String(state.title || '').replace(/\s+/g, ' ').trim();
  const cleanDescription = String(state.description || '').replace(/\s+/g, ' ').trim();
  const duplicateTitle = Boolean(cleanTitle && cleanDescription && (
    cleanTitle === cleanDescription ||
    cleanDescription.startsWith(cleanTitle) ||
    cleanTitle.startsWith(cleanDescription)
  ));
  card.className = `share-card theme-${state.theme} ratio-${state.ratio} layout-${state.layout} source-${state.source} density-${density} title-${role} ${duplicateTitle ? 'title-duplicate' : ''} ${mediaState} font-${state.font || 'sans'}`;
  card.style.setProperty('--theme-a', theme.stops[0]);
  card.style.setProperty('--theme-b', theme.stops[1]);
  card.style.setProperty('--theme-c', theme.stops[2]);
  card.style.setProperty('--theme-surface', theme.surface);
  card.style.setProperty('--theme-text', theme.text);
  card.style.setProperty('--card-radius', `${state.radius || 0}px`);
  card.style.setProperty('--surface-pad', `${state.padding || 32}px`);
  const titleNode = qs('#preview-card-title');
  titleNode.textContent = state.title;
  titleNode.hidden = duplicateTitle || !cleanTitle;
  qs('#preview-card-description').textContent = state.description;
  const sourceLabel = state.sourceLabel || sourceData[state.source].name;
  const publisherLabel = state.author || sourceLabel;
  qs('#source-name').textContent = publisherLabel;
  const sourceMeta = qs('.card-number');
  if (sourceMeta) sourceMeta.textContent = sourceLabel;
  const byline = qs('#card-byline');
  if (byline) {
    byline.hidden = !sourceLabel;
    byline.textContent = '来源 · ' + sourceLabel;
  }
  const sourceIcon = qs('#source-icon-image');
  const sourceFallback = qs('.source-brand-fallback');
  sourceFallback.textContent = sourceData[state.source].icon;
  sourceIcon.hidden = !state.icon;
  sourceFallback.hidden = Boolean(state.icon);
  sourceIcon.src = state.icon || '';
  sourceIcon.alt = sourceLabel;
  qs('#card-kicker').textContent = liveKicker();
  renderMediaGallery();
  const now = new Date();
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  qs('#footer-date').textContent = `${time} · ${date}`;
  qs('#char-count').textContent = `${state.description.length} 字 · ${density === 'short' ? '短内容' : density === 'medium' ? '中等内容' : '长内容'}`;
  qs('#image-count').textContent = state.images?.length ? `${state.images.length} 张图片 · 自动排列` : '可多选，自动排列';
  qs('#canvas-size').textContent = state.ratio === 'auto' ? '1080 × 自动高度' : state.ratio === 'wide' ? '1600 × 900' : state.ratio === 'portrait' ? '1080 × 1350' : '1080 × 1080';
}

function selectSource(source, applyPreset = true) {
  state.source = source;
  qsa('.source-tab').forEach(tab => {
    const selected = tab.dataset.source === source;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  urlInput.placeholder = sourceData[source].placeholder;
  qs('#source-hint').textContent = sourceData[source].hint;
  if (applyPreset) {
    state.title = sourceData[source].title;
    state.description = sourceData[source].description;
    state.platform = source;
    state.sourceLabel = sourceData[source].name;
    state.contentStatus = 'ok';
    state.readingMinutes = null;
    state.image = sourceData[source].image;
    state.images = [sourceData[source].image];
    state.imageColor = null;
    state.sampledImageSrc = '';
    state.icon = sourceData[source].iconUrl;
    state.author = sourceData[source].name;
    authorInput.value = state.author;
    titleInput.value = state.title;
    descriptionInput.value = state.description;
  }
  refreshContentPalette();
}

qsa('.source-tab').forEach(tab => tab.addEventListener('click', () => selectSource(tab.dataset.source)));

qs('#ratio-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-ratio]');
  if (!button) return;
  state.ratio = button.dataset.ratio;
  qsa('#ratio-control button').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

qs('#layout-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-layout]');
  if (!button) return;
  state.layout = button.dataset.layout;
  qsa('#layout-control button').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

qs('#theme-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-theme]');
  if (!button) return;
  state.theme = button.dataset.theme;
  state.colorMode = 'manual';
  qs('#recommend-label').textContent = `当前主题 · ${themeConfig[state.theme].name}`;
  qsa('.theme-swatch').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

qs('#theme-toggle').addEventListener('click', () => {
  const list = qs('#theme-control');
  const expanded = list.classList.toggle('show-all');
  qs('#theme-toggle').textContent = expanded ? '收起主题' : '查看全部 18 个';
});

qs('#recommend-theme').addEventListener('click', () => {
  setRecommendedTheme();
  showToast('实时配色已开启，会跟随正文与配图更新');
});

qs('#font-control').addEventListener('change', event => { state.font = event.target.value; updateCard(); });
qs('#radius-control').addEventListener('input', event => { state.radius = Number(event.target.value); qs('#radius-value').textContent = event.target.value; updateCard(); });
qs('#padding-control').addEventListener('input', event => { state.padding = Number(event.target.value); qs('#padding-value').textContent = event.target.value; updateCard(); });

let zoomLevel = 85;
function setZoom(next) {
  zoomLevel = Math.max(60, Math.min(110, next));
  card.style.setProperty('--preview-scale', zoomLevel / 100);
  qs('#zoom-value').textContent = `${zoomLevel}%`;
}
qs('#zoom-out').addEventListener('click', () => setZoom(zoomLevel - 5));
qs('#zoom-in').addEventListener('click', () => setZoom(zoomLevel + 5));

refreshContentPalette();
setZoom(85);

titleInput.addEventListener('input', () => {
  state.title = titleInput.value || '输入你的标题';
  schedulePaletteRefresh();
});
authorInput.addEventListener('input', () => {
  state.author = authorInput.value || sourceData[state.source].name;
  updateCard();
});

descriptionInput.addEventListener('input', () => {
  state.description = descriptionInput.value.slice(0, 2000);
  state.readingMinutes = null;
  if (descriptionInput.value !== state.description) descriptionInput.value = state.description;
  schedulePaletteRefresh();
});

qs('#image-upload').addEventListener('change', async event => {
  const files = [...(event.target.files || [])].slice(0, 6);
  if (!files.length) return;
  if (files.some(file => file.size > 8 * 1024 * 1024)) return showToast('每张图片请控制在 8MB 以内');
  state.images = await Promise.all(files.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
  state.image = state.images[0];
  state.imageColor = null;
  state.sampledImageSrc = '';
  refreshContentPalette();
  showToast(`已载入 ${state.images.length} 张图片，版式已自动调整`);
});

qs('#source-icon-image').addEventListener('error', () => {
  qs('#source-icon-image').hidden = true;
  qs('.source-brand-fallback').hidden = false;
});

qs('#generate-button').addEventListener('click', async () => {
  const button = qs('#generate-button');
  const rawValue = urlInput.value.trim();
  const value = extractUrlFromShare(rawValue);
  if (!value) { urlInput.focus(); return showToast('请粘贴包含 https:// 的公开链接或分享口令'); }
  urlInput.value = value;
  button.classList.add('loading');
  button.textContent = '正在生成…';
  state.url = value;
  state.platform = state.source;
  state.contentStatus = 'ok';
  state.readingMinutes = null;
  state.icon = iconForUrl(value);
  state.image = '';
  state.images = [];
  state.imageColor = null;
  state.sampledImageSrc = '';
  const host = new URL(value).hostname.replace(/^www\./, '').toUpperCase();
  sourceData[state.source].name = host;
  state.title = host;
  state.description = '';
  state.author = host;
  state.sourceLabel = host;
  authorInput.value = state.author;
  titleInput.value = state.title;
  descriptionInput.value = '';
  try {
    const response = await fetch('/api/extract?url=' + encodeURIComponent(value));
    const metadata = await response.json().catch(() => null);
    if (!response.ok) throw new Error(metadata?.detail || metadata?.error || '提取失败');
    state.title = metadata?.title || host;
    state.platform = metadata?.platform || state.source;
    if (sourceData[state.platform]) {
      state.source = state.platform;
      qsa('.source-tab').forEach(tab => {
        const selected = tab.dataset.source === state.source;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-selected', String(selected));
      });
    }
    state.author = metadata?.author || metadata?.platformLabel || host;
    authorInput.value = state.author;
    const sourceLabels = { douyin: '抖音视频', weibo: '微博', xiaohongshu: '小红书', instagram: 'Instagram', x: 'X' };
    state.sourceLabel = sourceLabels[state.platform] || metadata?.platformLabel || host;
    state.contentStatus = metadata?.status || 'ok';
    state.readingMinutes = Number.isFinite(metadata?.readingMinutes) ? metadata.readingMinutes : estimateReadingMinutes(metadata?.description);
    const accessMessage = metadata?.status === 'login_required'
      ? `${metadata.platformLabel || '该平台'}限制匿名读取，请上传截图或手动粘贴正文`
      : metadata?.status === 'unavailable'
        ? `${metadata.platformLabel || '该内容'}已下架、审核中或仅自己可见，可手动粘贴正文继续排版`
        : metadata?.status === 'partial'
          ? '只提取到有限公开信息，可手动补充标题、正文和图片'
          : '';
    state.description = (metadata?.description || accessMessage).slice(0, 2000);
    titleInput.value = state.title;
    descriptionInput.value = state.description;
    const extractedImages = Array.isArray(metadata?.images)
      ? metadata.images.filter(Boolean)
      : (metadata?.image ? [metadata.image] : []);
    if (extractedImages.length) {
      state.images = [...new Set(extractedImages)].slice(0, 6);
      state.image = state.images[0];
      state.imageColor = null;
      state.sampledImageSrc = '';
    }
    if (metadata?.platformLabel) sourceData[state.source].name = metadata.platformLabel.toUpperCase();
    const extractStatus = qs('#extract-status');
    const extractSummary = qs('#extract-summary');
    extractStatus.hidden = false;
    extractStatus.classList.toggle('is-limited', metadata?.status !== 'ok');
    extractStatus.querySelector('strong').textContent = metadata?.status === 'ok' ? '已提取' : '需要补充';
    extractSummary.textContent = metadata?.status === 'ok'
      ? `${state.images.length} 张图片 · 可继续编辑`
      : (metadata?.status === 'login_required' ? '平台限制匿名读取' : '仅提取到公开摘要');
    if (metadata?.status === 'login_required') {
      showToast(`${metadata.platformLabel || '该平台'}限制匿名访问，可上传截图继续排版`);
    } else if (metadata?.status === 'partial') {
      showToast('只提取到有限公开信息，可继续手动补充');
    } else if (state.images.length > 1) {
      showToast(`已提取正文和 ${state.images.length} 张图片，可继续编辑`);
    } else {
      showToast(metadata?.title ? '已提取公开内容，可继续编辑' : '未找到公开内容，可手动编辑卡片');
    }
  } catch {
    showToast('暂时无法提取该链接，请重试或上传截图');
  } finally {
    refreshContentPalette();
    button.classList.remove('loading');
    button.innerHTML = '<span>生成卡片</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-4-4 4 4-4 4"/></svg>';
  }
});

qs('#reset-button').addEventListener('click', () => {
  Object.assign(state, defaults, { images: [...defaults.images] });
  urlInput.value = defaults.url;
  titleInput.value = defaults.title;
  descriptionInput.value = defaults.description;
  authorInput.value = defaults.author;
  qs('#extract-status').hidden = true;
  qs('#font-control').value = defaults.font;
  qs('#radius-control').value = defaults.radius;
  qs('#padding-control').value = defaults.padding;
  qsa('#ratio-control button').forEach(x => x.classList.toggle('active', x.dataset.ratio === state.ratio));
  qsa('#layout-control button').forEach(x => x.classList.toggle('active', x.dataset.layout === state.layout));
  qsa('.theme-swatch').forEach(x => x.classList.toggle('active', x.dataset.theme === state.theme));
  selectSource('web', false);
  showToast('已恢复默认样式');
});

qsa('.recent-card').forEach(item => item.addEventListener('click', () => {
  const preset = item.dataset.preset;
  if (sourceData[preset]) selectSource(preset);
  document.querySelector('#studio').scrollIntoView({ behavior: 'smooth' });
}));

qs('#clear-recent').addEventListener('click', () => {
  const grid = qs('.recent-grid');
  grid.innerHTML = '';
  grid.classList.add('is-empty');
});

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = [...text];
  let line = '', lines = [];
  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = char; }
    else line = test;
  }
  if (line) lines.push(line);
  lines = lines.slice(0, maxLines);
  lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function canvasLines(ctx, text, maxWidth, maxLines = Infinity) {
  const lines = [];
  for (const paragraph of String(text || '').split(/\n/)) {
    if (!paragraph) { lines.push(''); continue; }
    let line = '';
    for (const char of [...paragraph]) {
      const test = line + char;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = char;
        if (lines.length >= maxLines) return lines;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    if (lines.length >= maxLines) return lines.slice(0, maxLines);
  }
  return lines.slice(0, maxLines);
}

function drawCanvasLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function currentTheme() {
  return state.theme === 'dynamic'
    ? (state.dynamicTheme || paletteForContent())
    : (themeConfig[state.theme] || themeConfig.coastal);
}

function canvasContent() {
  const title = String(state.title || '').replace(/\s+/g, ' ').trim();
  const description = String(state.description || '').replace(/\s+/g, ' ').trim();
  const duplicateTitle = Boolean(title && description && (
    title === description || description.startsWith(title) || title.startsWith(description)
  ));
  const sourceLabel = state.sourceLabel || sourceData[state.source].name;
  return {
    title: duplicateTitle ? '' : title,
    description,
    source: state.author || sourceLabel,
    byline: sourceLabel ? '来源 · ' + sourceLabel : '',
  };
}

async function downloadAutoCard() {
  const width = 1080;
  const outer = 38;
  const surfacePad = 58;
  const contentX = outer + surfacePad;
  const contentW = width - contentX * 2;
  const density = contentDensity(state.description);
  const bodyFont = density === 'short' ? 48 : density === 'medium' ? 38 : 31;
  const bodyLine = density === 'short' ? 70 : density === 'medium' ? 60 : 52;
  const measure = document.createElement('canvas').getContext('2d');
  const content = canvasContent();
  const role = titleRole(content.title);
  const titleFont = role === 'headline' ? 38 : 26;
  const titleLine = role === 'headline' ? 54 : 38;
  measure.font = `600 ${titleFont}px "Microsoft YaHei", sans-serif`;
  const titleLines = canvasLines(measure, content.title, contentW, role === 'headline' ? 3 : 2);
  measure.font = `500 ${bodyFont}px "Microsoft YaHei", sans-serif`;
  const bodyLines = canvasLines(measure, content.description, contentW);
  const loadedImages = (await Promise.all((state.images || []).slice(0, 6).map(src => loadImage(src).catch(() => null)))).filter(Boolean);
  const imageHeights = loadedImages.map(image => Math.min(640, Math.max(260, Math.round(contentW * image.height / image.width))));
  const mediaHeight = imageHeights.reduce((sum, value) => sum + value, 0) + Math.max(0, imageHeights.length - 1) * 18;
  const titleGap = titleLines.length ? 24 : 0;
  const bylineHeight = content.byline ? 50 : 0;
  const contentHeight = 86 + 36 + titleLines.length * titleLine + titleGap + bodyLines.length * bodyLine + bylineHeight + (mediaHeight ? 38 + mediaHeight : 0) + 110;
  const minimumHeight = loadedImages.length ? 1180 : 820;
  const height = Math.min(7600, Math.max(minimumHeight, outer * 2 + surfacePad * 2 + contentHeight));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const theme = currentTheme();
  const stops = theme.stops;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(.46, stops[1]);
  gradient.addColorStop(1, stops[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  const dark = theme.dark;
  ctx.fillStyle = dark ? 'rgba(20,21,25,.82)' : 'rgba(255,255,255,.76)';
  ctx.beginPath();
  ctx.roundRect(outer, outer, width - outer * 2, height - outer * 2, 34);
  ctx.fill();
  ctx.fillStyle = dark ? '#fff' : '#17181b';
  ctx.textBaseline = 'top';
  let y = outer + surfacePad;
  let icon = null;
  if (state.icon?.startsWith('data:')) {
    try { icon = await loadImage(state.icon); } catch {}
  }
  if (icon) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(contentX + 23, y + 23, 23, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(icon, contentX, y, 46, 46);
    ctx.restore();
  }
  ctx.font = '700 22px "Microsoft YaHei", sans-serif';
  ctx.fillText(content.source, contentX + 62, y + 9);
  ctx.globalAlpha = .48;
  ctx.textAlign = 'right';
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText(state.sourceLabel || sourceData[state.source].name, width - contentX, y + 12);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
  y += 86;
  ctx.globalAlpha = .55;
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText(liveKicker(), contentX, y);
  ctx.globalAlpha = 1;
  y += 36;
  ctx.globalAlpha = .7;
  ctx.font = `600 ${titleFont}px "Microsoft YaHei", sans-serif`;
  y = drawCanvasLines(ctx, titleLines, contentX, y, titleLine);
  ctx.globalAlpha = 1;
  y += 24;
  ctx.font = `500 ${bodyFont}px "Microsoft YaHei", sans-serif`;
  y = drawCanvasLines(ctx, bodyLines, contentX, y, bodyLine);
  if (content.byline) {
    y += 18;
    ctx.globalAlpha = .52;
    ctx.font = '600 18px "Microsoft YaHei", sans-serif';
    ctx.fillText(content.byline, contentX, y);
    ctx.globalAlpha = 1;
    y += 32;
  }
  if (loadedImages.length) y += 38;
  for (let index = 0; index < loadedImages.length; index += 1) {
    const image = loadedImages[index];
    const imageHeight = imageHeights[index];
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(contentX, y, contentW, imageHeight, 20);
    ctx.clip();
    const scale = Math.max(contentW / image.width, imageHeight / image.height);
    const sw = contentW / scale;
    const sh = imageHeight / scale;
    ctx.drawImage(image, (image.width - sw) / 2, (image.height - sh) / 2, sw, sh, contentX, y, contentW, imageHeight);
    ctx.restore();
    y += imageHeight + 18;
  }
  const footerY = height - outer - surfacePad - 48;
  ctx.globalAlpha = .42;
  ctx.strokeStyle = dark ? '#fff' : '#17181b';
  ctx.beginPath();
  ctx.moveTo(contentX, footerY - 24);
  ctx.lineTo(width - contentX, footerY - 24);
  ctx.stroke();
  ctx.font = '500 18px Arial, sans-serif';
  ctx.fillText(new Date().toLocaleDateString('zh-CN') + ' · CARDLY', contentX, footerY);
  try {
    const qr = await loadImage(qs('.qr-code').src);
    ctx.globalAlpha = 1;
    ctx.drawImage(qr, width - contentX - 72, footerY - 12, 72, 72);
  } catch {}
  ctx.globalAlpha = .3;
  ctx.textAlign = 'center';
  ctx.font = '600 15px Arial, sans-serif';
  ctx.fillText('CARDLY · 制作卡片', width / 2, height - 26);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
  canvas.toBlob(blob => {
    if (!blob) return showToast('导出失败，请重试');
    const link = document.createElement('a');
    link.download = `cardly-auto-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('自适应长图已下载');
  }, 'image/png');
}

async function downloadCard() {
  if (state.ratio === 'auto') return downloadAutoCard();
  const sizes = { square: [1080,1080], wide: [1600,900], portrait: [1080,1350] };
  const [width, height] = sizes[state.ratio];
  const theme = currentTheme();
  const content = canvasContent();
  const light = !theme.dark;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0,0,width,height);
  gradient.addColorStop(0, theme.stops[0]);
  gradient.addColorStop(.46, theme.stops[1]);
  gradient.addColorStop(1, theme.stops[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,width,height);
  const pad = Math.round(width * .06);
  ctx.fillStyle = light ? '#111216' : '#ffffff';
  ctx.textBaseline = 'top';
  ctx.font = `600 ${Math.round(width*.017)}px Arial, sans-serif`;
  ctx.fillText(content.source, pad, pad);
  ctx.globalAlpha = .72;
  ctx.textAlign = 'right'; ctx.fillText(state.sourceLabel || sourceData[state.source].name, width-pad, pad); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  let image;
  try { image = await loadImage(state.images?.[0] || state.image); } catch { image = null; }
  const isWide = state.ratio === 'wide';
  const imageX = pad, imageY = pad*1.75;
  const imageW = isWide ? width*.51 : width-pad*2;
  const imageH = isWide ? height-pad*2.55 : height*(state.ratio==='portrait' ? .43 : .39);
  if (image) {
    const scale = Math.max(imageW/image.width, imageH/image.height);
    const sw = imageW/scale, sh = imageH/scale;
    ctx.drawImage(image, (image.width-sw)/2, (image.height-sh)/2, sw, sh, imageX, imageY, imageW, imageH);
  } else { ctx.globalAlpha=.16; ctx.fillStyle='#fff'; ctx.fillRect(imageX,imageY,imageW,imageH); ctx.globalAlpha=1; }
  const textX = isWide ? imageX+imageW+pad*.7 : pad;
  const textY = isWide ? imageY+height*.08 : imageY+imageH+pad*.55;
  const textW = isWide ? width-textX-pad : width-pad*2;
  ctx.fillStyle = light ? '#111216' : '#ffffff';
  ctx.globalAlpha=.7; ctx.font = `600 ${Math.round(width*(isWide?.009:.011))}px Arial, sans-serif`; ctx.fillText(liveKicker(), textX, textY); ctx.globalAlpha=1;
  ctx.globalAlpha=.68;
  ctx.font = `600 ${Math.round(width*(isWide?.012:.018))}px "Microsoft YaHei", sans-serif`;
  const afterPublisher = content.title
    ? wrapText(ctx,content.title,textX,textY+pad*.45,textW,Math.round(width*(isWide?.017:.026)),2)
    : textY + pad * .34;
  ctx.globalAlpha=1;
  ctx.font=`560 ${Math.round(width*(isWide?.024:.04))}px "Microsoft YaHei", sans-serif`;
  const afterBody = wrapText(ctx,content.description,textX,afterPublisher+pad*.22,textW,Math.round(width*(isWide?.032:.052)),isWide?4:3);
  if (content.byline) {
    ctx.globalAlpha = .58;
    ctx.font = '600 ' + Math.round(width*(isWide?.01:.014)) + 'px "Microsoft YaHei", sans-serif';
    ctx.fillText(content.byline, textX, afterBody + pad * .18);
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle=light?'#111216':'#fff'; ctx.globalAlpha=.6; ctx.beginPath(); ctx.moveTo(pad,height-pad*.85); ctx.lineTo(width-pad,height-pad*.85); ctx.stroke();
  ctx.font=`500 ${Math.round(width*.012)}px Arial, sans-serif`; ctx.fillText('CARDLY · SHARE BEAUTIFULLY',pad,height-pad*.55); ctx.textAlign='right'; ctx.fillText('↗',width-pad,height-pad*.62); ctx.globalAlpha=1;
  canvas.toBlob(blob => {
    if (!blob) return showToast('导出失败，请重试');
    const link = document.createElement('a');
    link.download = `cardly-${state.source}-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob); link.click(); URL.revokeObjectURL(link.href);
    showToast('PNG 已下载');
  }, 'image/png');
}

qsa('[data-download]').forEach(button => button.addEventListener('click', downloadCard));
updateCard();
