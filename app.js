function svgIcon(body) {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(body);
}

const platformIcons = {
  x: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111" d="M18.9 2h3.7l-8.1 9.3L24 22h-7.4l-5.8-7.6L4.2 22H.5l8.6-9.8L0 2h7.6l5.3 6.9L18.9 2Zm-1.3 18h2L6.5 3.9H4.3L17.6 20Z"/></svg>'),
  weibo: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse cx="11" cy="14" rx="9" ry="6.5" fill="#e6162d"/><ellipse cx="10" cy="14" rx="5" ry="3.4" fill="#fff"/><circle cx="9" cy="13.5" r="1.7" fill="#111"/><path d="M15 7c3-1 5 1 5 3" fill="none" stroke="#f5c400" stroke-width="2" stroke-linecap="round"/></svg>'),
  telegram: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#229ed9"/><path fill="#fff" d="m5 11.5 13-5-2.3 11.2c-.2.8-.8 1-1.5.6l-3.5-2.6-1.7 1.7c-.2.2-.3.3-.7.3l.3-3.6 6.5-5.9c.3-.3-.1-.4-.4-.2l-8 5-3.4-1.1c-.7-.2-.7-.7.2-1Z"/></svg>'),
  instagram: svgIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#d62976"/><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17" cy="7" r="1.1" fill="#fff"/></svg>')
};

function iconForUrl(value) {
  const parsed = new URL(value);
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'x.com' || host === 'twitter.com') return platformIcons.x;
  if (host === 'weibo.com' || host.endsWith('.weibo.com')) return platformIcons.weibo;
  if (host === 't.me' || host === 'telegram.org') return platformIcons.telegram;
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) return platformIcons.instagram;
  return new URL('/favicon.ico', parsed.origin).href;
}

const defaults = {
  source: 'web',
  ratio: 'auto',
  layout: 'editorial',
  theme: 'mist',
  url: 'https://www.archdaily.cn/cn/1012043',
  title: '在海风与山影之间，重新想象公共空间',
  description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
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

const state = { ...defaults, images: [...defaults.images] };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const card = $('#share-card');
const titleInput = $('#card-title');
const descriptionInput = $('#card-description');
const urlInput = $('#source-url');

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
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

function renderMediaGallery() {
  const gallery = $('#media-gallery');
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
  card.className = `share-card theme-${state.theme} ratio-${state.ratio} layout-${state.layout} source-${state.source} density-${density} title-${role} ${mediaState}`;
  $('#preview-card-title').textContent = state.title;
  $('#preview-card-description').textContent = state.description;
  $('#source-name').textContent = sourceData[state.source].name;
  const sourceIcon = $('#source-icon-image');
  const sourceFallback = $('.source-brand-fallback');
  sourceFallback.textContent = sourceData[state.source].icon;
  sourceIcon.hidden = !state.icon;
  sourceFallback.hidden = Boolean(state.icon);
  sourceIcon.src = state.icon || '';
  $('#card-kicker').textContent = sourceData[state.source].kicker;
  renderMediaGallery();
  const now = new Date();
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  $('#footer-date').textContent = `${time} · ${date}`;
  $('#char-count').textContent = `${state.description.length} 字 · ${density === 'short' ? '短内容' : density === 'medium' ? '中等内容' : '长内容'}`;
  $('#image-count').textContent = state.images?.length ? `${state.images.length} 张图片 · 自动排列` : '可多选，自动排列';
  $('#canvas-size').textContent = state.ratio === 'auto' ? '1080 × 自动高度' : state.ratio === 'wide' ? '1600 × 900' : state.ratio === 'portrait' ? '1080 × 1350' : '1080 × 1080';
}

function selectSource(source, applyPreset = true) {
  state.source = source;
  $$('.source-tab').forEach(tab => {
    const selected = tab.dataset.source === source;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  urlInput.placeholder = sourceData[source].placeholder;
  $('#source-hint').textContent = sourceData[source].hint;
  if (applyPreset) {
    state.title = sourceData[source].title;
    state.description = sourceData[source].description;
    state.image = sourceData[source].image;
    state.images = [sourceData[source].image];
    state.icon = sourceData[source].iconUrl;
    titleInput.value = state.title;
    descriptionInput.value = state.description;
  }
  updateCard();
}

$$('.source-tab').forEach(tab => tab.addEventListener('click', () => selectSource(tab.dataset.source)));

$('#ratio-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-ratio]');
  if (!button) return;
  state.ratio = button.dataset.ratio;
  $$('#ratio-control button').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

$('#layout-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-layout]');
  if (!button) return;
  state.layout = button.dataset.layout;
  $$('#layout-control button').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

$('#theme-control').addEventListener('click', event => {
  const button = event.target.closest('button[data-theme]');
  if (!button) return;
  state.theme = button.dataset.theme;
  $$('.theme-swatch').forEach(item => item.classList.toggle('active', item === button));
  updateCard();
});

titleInput.addEventListener('input', () => { state.title = titleInput.value || '输入你的标题'; updateCard(); });
descriptionInput.addEventListener('input', () => {
  state.description = descriptionInput.value.slice(0, 2000);
  if (descriptionInput.value !== state.description) descriptionInput.value = state.description;
  updateCard();
});

$('#image-upload').addEventListener('change', async event => {
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

$('#source-icon-image').addEventListener('error', () => {
  $('#source-icon-image').hidden = true;
  $('.source-brand-fallback').hidden = false;
});

$('#generate-button').addEventListener('click', async () => {
  const button = $('#generate-button');
  const value = urlInput.value.trim();
  if (!value) { urlInput.focus(); return showToast('请先粘贴内容链接'); }
  try { new URL(value); } catch { urlInput.focus(); return showToast('请输入完整的 https:// 链接'); }
  button.classList.add('loading');
  button.textContent = '正在生成…';
  state.url = value;
  state.icon = iconForUrl(value);
  state.image = '';
  state.images = [];
  const host = new URL(value).hostname.replace(/^www\./, '').toUpperCase();
  sourceData[state.source].name = host;
  try {
    const response = await fetch('/api/extract?url=' + encodeURIComponent(value));
    const metadata = response.ok ? await response.json() : null;
    if (metadata?.title) {
      state.title = metadata.title;
      titleInput.value = state.title;
    }
    if (metadata?.description) {
      state.description = metadata.description.slice(0, 2000);
      descriptionInput.value = state.description;
    }
    if (metadata?.image) {
      state.image = metadata.image;
      state.images = [metadata.image];
    }
    showToast(metadata?.title ? '已提取公开内容，可继续编辑' : '平台未开放元数据，已载入卡片模板');
  } catch {
    showToast('平台未开放元数据，已载入卡片模板');
  } finally {
    updateCard();
    button.classList.remove('loading');
    button.textContent = '生成卡片';
  }
});

$('#reset-button').addEventListener('click', () => {
  Object.assign(state, defaults, { images: [...defaults.images] });
  urlInput.value = defaults.url;
  titleInput.value = defaults.title;
  descriptionInput.value = defaults.description;
  $$('#ratio-control button').forEach(x => x.classList.toggle('active', x.dataset.ratio === state.ratio));
  $$('#layout-control button').forEach(x => x.classList.toggle('active', x.dataset.layout === state.layout));
  $$('.theme-swatch').forEach(x => x.classList.toggle('active', x.dataset.theme === state.theme));
  selectSource('web', false);
  showToast('已恢复默认样式');
});

$$('.recent-card').forEach(item => item.addEventListener('click', () => {
  const preset = item.dataset.preset;
  if (sourceData[preset]) selectSource(preset);
  document.querySelector('#studio').scrollIntoView({ behavior: 'smooth' });
}));

$('#clear-recent').addEventListener('click', () => {
  const grid = $('.recent-grid');
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
  const backgrounds = {
    mist: ['#ffd9c7', '#f6e4e9', '#cee7ff'],
    cobalt: ['#284bff', '#739dff', '#d4e2ff'],
    ink: ['#15161a', '#343741', '#6d7282'],
    coral: ['#ef5e52', '#ffc8b7', '#ffe2d5'],
    lime: ['#c4df48', '#e9f3a9', '#f6f7d5'],
    paper: ['#e7dfcf', '#f2ede4', '#fbfaf6']
  };
  const stops = backgrounds[state.theme] || backgrounds.mist;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(.46, stops[1]);
  gradient.addColorStop(1, stops[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  const dark = ['cobalt', 'ink'].includes(state.theme);
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
  ctx.fillText(sourceData[state.source].name, contentX + 62, y + 9);
  ctx.globalAlpha = .48;
  ctx.textAlign = 'right';
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText('CARDLY / AUTO', width - contentX, y + 12);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
  y += 86;
  ctx.globalAlpha = .55;
  ctx.font = '600 18px Arial, sans-serif';
  ctx.fillText(sourceData[state.source].kicker, contentX, y);
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
    const qr = await loadImage($('.qr-code').src);
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
  const colors = { cobalt:'#2251ff', ink:'#15161a', coral:'#ef5e52', lime:'#c4df48', paper:'#eee9dd', mist:'#f7eef5' };
  const light = ['lime','paper','mist'].includes(state.theme);
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (state.theme === 'mist') {
    const gradient = ctx.createLinearGradient(0,0,width,height);
    gradient.addColorStop(0,'#fff0f2'); gradient.addColorStop(.46,'#f7f0fb'); gradient.addColorStop(1,'#d5effb');
    ctx.fillStyle = gradient;
  } else ctx.fillStyle = colors[state.theme];
  ctx.fillRect(0,0,width,height);
  const pad = Math.round(width * .06);
  ctx.fillStyle = light ? '#111216' : '#ffffff';
  ctx.textBaseline = 'top';
  ctx.font = `600 ${Math.round(width*.017)}px Arial, sans-serif`;
  ctx.fillText(sourceData[state.source].name, pad, pad);
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
  ctx.globalAlpha=.7; ctx.font = `600 ${Math.round(width*(isWide?.009:.011))}px Arial, sans-serif`; ctx.fillText(sourceData[state.source].kicker, textX, textY); ctx.globalAlpha=1;
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

$$('[data-download]').forEach(button => button.addEventListener('click', downloadCard));
updateCard();
