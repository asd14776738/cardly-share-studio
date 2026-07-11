const defaults = {
  source: 'web',
  ratio: 'square',
  layout: 'editorial',
  theme: 'mist',
  url: 'https://www.archdaily.cn/cn/1012043',
  title: '在海风与山影之间，重新想象公共空间',
  description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
  image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=88'
};

const sourceData = {
  web: {
    hint: '支持文章、作品集、产品页等公开网页',
    placeholder: 'https://example.com/article',
    name: 'ARCHDAILY.CN', icon: '⌁', kicker: 'ARCHITECTURE · 6 MIN READ',
    title: '在海风与山影之间，重新想象公共空间',
    description: '一座面向海岸的文化建筑，以层叠露台连接城市生活与自然景观。',
    image: defaults.image
  },
  telegram: {
    hint: '粘贴公开频道或公开消息链接',
    placeholder: 'https://t.me/channel/123',
    name: 'TELEGRAM · @FUTURESPACE', icon: '↗', kicker: 'CHANNEL POST · 2 HOURS AGO',
    title: '城市不是建成的，它每天都在被重新协商。',
    description: '从街角座椅到夜间照明，微小的公共决策正在改变我们感受城市的方式。',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=88'
  },
  x: {
    hint: '粘贴公开帖子链接，自动提取作者和正文',
    placeholder: 'https://x.com/user/status/…',
    name: 'X · @DESIGNNOTES', icon: '𝕏', kicker: 'POST · JUL 11, 2026',
    title: 'Good design makes complexity feel inevitable.',
    description: 'The best interfaces do not remove depth. They give it rhythm, hierarchy and a human pace.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=88'
  },
  instagram: {
    hint: '粘贴公开帖子或 Reel 链接',
    placeholder: 'https://www.instagram.com/p/…',
    name: 'INSTAGRAM · @SLOW.WEEKEND', icon: '◎', kicker: 'PHOTO · SHANGHAI',
    title: '週末，在城市里收集光影。',
    description: '穿过旧街区，玻璃、树影和晾晒的衣服让平常的一天有了电影感。',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1600&q=88'
  }
};

const state = { ...defaults };
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

function updateCard() {
  card.className = `share-card theme-${state.theme} ratio-${state.ratio} layout-${state.layout} source-${state.source}`;
  $('#preview-card-title').textContent = state.title;
  $('#preview-card-description').textContent = state.description;
  $('#source-name').textContent = sourceData[state.source].name;
  $('.source-brand-icon').textContent = sourceData[state.source].icon;
  $('#card-kicker').textContent = sourceData[state.source].kicker;
  $('#cover-image').src = state.image;
  $('#char-count').textContent = `${state.description.length} / 120`;
  $('#canvas-size').textContent = state.ratio === 'wide' ? '1600 × 900' : state.ratio === 'portrait' ? '1080 × 1350' : '1080 × 1080';
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
  if (descriptionInput.value.length > 120) descriptionInput.value = descriptionInput.value.slice(0, 120);
  state.description = descriptionInput.value;
  updateCard();
});

$('#image-upload').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) return showToast('图片请控制在 8MB 以内');
  const reader = new FileReader();
  reader.onload = () => { state.image = reader.result; updateCard(); showToast('封面已更新'); };
  reader.readAsDataURL(file);
});

$('#generate-button').addEventListener('click', async () => {
  const button = $('#generate-button');
  const value = urlInput.value.trim();
  if (!value) { urlInput.focus(); return showToast('请先粘贴内容链接'); }
  try { new URL(value); } catch { urlInput.focus(); return showToast('请输入完整的 https:// 链接'); }
  button.classList.add('loading');
  button.textContent = '正在生成…';
  state.url = value;
  const host = new URL(value).hostname.replace(/^www\./, '').toUpperCase();
  sourceData[state.source].name = state.source === 'web' ? host : sourceData[state.source].name;
  try {
    const response = await fetch('/api/extract?url=' + encodeURIComponent(value));
    const metadata = response.ok ? await response.json() : null;
    if (metadata?.title) {
      state.title = metadata.title;
      titleInput.value = state.title;
    }
    if (metadata?.description) {
      state.description = metadata.description.slice(0, 120);
      descriptionInput.value = state.description;
    }
    if (metadata?.image) state.image = metadata.image;
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
  Object.assign(state, defaults);
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

async function downloadCard() {
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
  try { image = await loadImage(state.image); } catch { image = null; }
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
  ctx.font = `600 ${Math.round(width*(isWide?.033:.055))}px "Microsoft YaHei", sans-serif`;
  const afterTitle = wrapText(ctx,state.title,textX,textY+pad*.45,textW,Math.round(width*(isWide?.041:.067)),isWide?4:3);
  if (state.layout !== 'minimal') { ctx.globalAlpha=.76; ctx.font=`400 ${Math.round(width*(isWide?.012:.022))}px "Microsoft YaHei", sans-serif`; wrapText(ctx,state.description,textX,afterTitle+pad*.2,textW,Math.round(width*(isWide?.02:.034)),3); ctx.globalAlpha=1; }
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
