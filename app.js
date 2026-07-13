import { estimateReadingMinutes, buildKicker } from './reading-time.js';

function svgIcon(body) {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(body);
}

function brandTile(label, background, foreground = '#fff', size = 10) {
  return svgIcon(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="${background}"/><text x="12" y="15.7" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="${size}" font-weight="800" fill="${foreground}">${label}</text></svg>`);
}

const platformIcons = {
  x: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111" d="M18.9 2h3.7l-8.1 9.3L24 22h-7.4l-5.8-7.6L4.2 22H.5l8.6-9.8L0 2h7.6l5.3 6.9L18.9 2Zm-1.3 18h2L6.5 3.9H4.3L17.6 20Z"/></svg>'),
  weibo: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse cx="11" cy="14" rx="9" ry="6.5" fill="#e6162d"/><ellipse cx="10" cy="14" rx="5" ry="3.4" fill="#fff"/><circle cx="9" cy="13.5" r="1.7" fill="#111"/><path d="M15 7c3-1 5 1 5 3" fill="none" stroke="#f5c400" stroke-width="2" stroke-linecap="round"/></svg>'),
  telegram: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#229ed9"/><path fill="#fff" d="m5 11.5 13-5-2.3 11.2c-.2.8-.8 1-1.5.6l-3.5-2.6-1.7 1.7c-.2.2-.3.3-.7.3l.3-3.6 6.5-5.9c.3-.3-.1-.4-.4-.2l-8 5-3.4-1.1c-.7-.2-.7-.7.2-1Z"/></svg>'),
  instagram: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#d62976"/><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17" cy="7" r="1.1" fill="#fff"/></svg>'),
  zhihu: brandTile('知', '#1772f6', '#fff', 12),
  wechat: brandTile('微', '#07c160', '#fff', 12),
  xiaohongshu: brandTile('RED', '#ff2442', '#fff', 7),
  jike: brandTile('J', '#ffe411', '#111', 13),
  netease: brandTile('♪', '#e60026', '#fff', 15),
  qqmusic: brandTile('QQ', '#31c27c', '#fff', 8),
  douban: brandTile('豆', '#2e963d', '#fff', 12),
  douyin: brandTile('♪', '#111', '#25f4ee', 15),
  spotify: brandTile('≋', '#1ed760', '#111', 16),
  apple: brandTile('♫', '#111', '#fff', 14),
  threads: brandTile('@', '#111', '#fff', 14),
  chatgpt: brandTile('AI', '#10a37f', '#fff', 8),
  kimi: brandTile('K', '#111', '#fff', 13)
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
  ratio: 'auto',
  layout: 'editorial',
  theme: 'coastal',
  font: 'serif',
  radius: 24,
  padding: 36,
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

function recommendedThemeForPlatform(platform) {
  const map = { weibo: 'berry', douyin: 'midnight', x: 'ink', threads: 'mono', xiaohongshu: 'film', instagram: 'rose', telegram: 'sky', wechat: 'jade', zhihu: 'cobalt', netease_music: 'rose', qq_music: 'jade', spotify: 'moss', apple_music: 'mono', douban: 'paper' };
  return map[platform] || 'coastal';
}

function setRecommendedTheme(themeName) {
  const theme = themeConfig[themeName] || themeConfig.coastal;
  state.recommendedTheme = themeName;
  const label = qs('#recommend-label');
  if (label) label.textContent = `已根据内容匹配 · ${theme.name}`;
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
    image.src = src;
    image.alt = `内容图片 ${index + 1}`;
    image.crossOrigin = src.startsWith('data:') ? null : 'anonymous';
    image.addEventListener('load', () => {
      if (image.naturalHeight / image.naturalWidth > 1.25) tallCount += 1;
      gallery.classList.toggle('is-tall', tallCount > 0);
    }, { once: true });
    gallery.appendChild(image);
  });
}

function updateCard() {
  const density = contentDensity(state.description);
  const role = titleRole(state.title);
  const mediaState = (state.images || []).some(Boolean) ? 'has-media' : 'no-media';
  const theme = themeConfig[state.theme] || themeConfig.coastal;
  card.className = `share-card theme-${state.theme} ratio-${state.ratio} layout-${state.layout} source-${state.source} density-${density} title-${role} ${mediaState} font-${state.font || 'serif'}`;
  card.style.setProperty('--theme-a', theme.stops[0]);
  card.style.setProperty('--theme-b', theme.stops[1]);
  card.style.setProperty('--theme-c', theme.stops[2]);
  card.style.setProperty('--theme-surface', theme.surface);
  card.style.setProperty('--theme-text', theme.text);
  card.style.setProperty('--card-radius', `${state.radius || 0}px`);
  card.style.setProperty('--surface-pad', `${state.padding || 36}px`);
  qs('#preview-card-title').textContent = state.title;
  qs('#preview-card-description').textContent = state.description;
  qs('#source-name').textContent = state.author || sourceData[state.source].name;
  const sourceIcon = qs('#source-icon-image');
  const sourceFallback = qs('.source-brand-fallback');
  sourceFallback.textContent = sourceData[state.source].icon;
  sourceIcon.hidden = !state.icon;
  sourceFallback.hidden = Boolean(state.icon);
  sourceIcon.src = state.icon || '';
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
    state.contentStatus = 'ok';
    state.readingMinutes = null;
    state.image = sourceData[source].image;
    state.images = [sourceData[source].image];
    state.icon = sourceData[source].iconUrl;
    state.author = sourceData[source].name;
    authorInput.value = state.author;
    titleInput.value = state.title;
    descriptionInput.value = state.description;
  }
  updateCard();
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
  state.theme = state.recommendedTheme || recommendedThemeForPlatform(state.platform);
  qsa('.theme-swatch').forEach(item => item.classList.toggle('active', item.dataset.theme === state.theme));
  updateCard();
  showToast(`已应用智能推荐 · ${themeConfig[state.theme].name}`);
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

setRecommendedTheme('coastal');
setZoom(85);

titleInput.addEventListener('input', () => { state.title = titleInput.value || '输入你的标题'; updateCard(); });
authorInput.addEventListener('input', () => { state.author = authorInput.value || sourceData[state.source].name; updateCard(); });

descriptionInput.addEventListener('input', () => {
  state.description = descriptionInput.value.slice(0, 2000);
  state.readingMinutes = null;
  if (descriptionInput.value !== state.description) descriptionInput.value = state.description;
  updateCard();
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
  updateCard();
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
  const host = new URL(value).hostname.replace(/^www\./, '').toUpperCase();
  sourceData[state.source].name = host;
  state.title = host;
  state.description = '';
  state.author = host;
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
    setRecommendedTheme(recommendedThemeForPlatform(state.platform));
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
    updateCard();
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
  const role = titleRole(state.title);
  const titleFont = role === 'headline' ? 38 : 26;
  const titleLine = role === 'headline' ? 54 : 38;
  measure.font = `600 ${titleFont}px "Microsoft YaHei", sans-serif`;
  const titleLines = canvasLines(measure, state.title, contentW, role === 'headline' ? 3 : 2);
  measure.font = `500 ${bodyFont}px "Microsoft YaHei", sans-serif`;
  const bodyLines = canvasLines(measure, state.description, contentW);
  const loadedImages = (await Promise.all((state.images || []).slice(0, 6).map(src => loadImage(src).catch(() => null)))).filter(Boolean);
  const imageHeights = loadedImages.map(image => Math.min(640, Math.max(260, Math.round(contentW * image.height / image.width))));
  const mediaHeight = imageHeights.reduce((sum, value) => sum + value, 0) + Math.max(0, imageHeights.length - 1) * 18;
  const contentHeight = 86 + 36 + titleLines.length * titleLine + 24 + bodyLines.length * bodyLine + (mediaHeight ? 38 + mediaHeight : 0) + 110;
  const minimumHeight = loadedImages.length ? 1180 : 820;
  const height = Math.min(7600, Math.max(minimumHeight, outer * 2 + surfacePad * 2 + contentHeight));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const theme = themeConfig[state.theme] || themeConfig.coastal;
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
  ctx.fillText(state.author || sourceData[state.source].name, contentX + 62, y + 9);
  ctx.globalAlpha = .48;
  ctx.textAlign = 'right';
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText('CARDLY / AUTO', width - contentX, y + 12);
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
  const theme = themeConfig[state.theme] || themeConfig.coastal;
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
  ctx.fillText(state.author || sourceData[state.source].name, pad, pad);
  ctx.globalAlpha = .72;
  ctx.textAlign = 'right'; ctx.fillText('CARD / 01', width-pad, pad); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
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
  const afterPublisher = wrapText(ctx,state.title,textX,textY+pad*.45,textW,Math.round(width*(isWide?.017:.026)),2);
  ctx.globalAlpha=1;
  ctx.font=`560 ${Math.round(width*(isWide?.024:.04))}px "Microsoft YaHei", sans-serif`;
  wrapText(ctx,state.description,textX,afterPublisher+pad*.22,textW,Math.round(width*(isWide?.032:.052)),isWide?4:3);
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
