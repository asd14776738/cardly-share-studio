const semanticFamilies = [
  { name: '海岸蓝', hue: 198, keywords: ['海边', '海岸', '海浪', '海风', '湖泊', '天空', '蓝天', '旅行', '岛屿', '风景', 'ocean', 'sea', 'sky', 'travel'] },
  { name: '林间绿', hue: 142, keywords: ['森林', '植物', '花园', '自然', '春日', '露营', '草地', 'green', 'nature', 'forest'] },
  { name: '烟火橙', hue: 28, keywords: ['食物', '美食', '咖啡', '烘焙', '甜品', '火锅', '晚餐', '南瓜', '料理', '厨艺', 'food', 'coffee', 'cake'] },
  { name: '花影粉', hue: 346, keywords: ['爱情', '浪漫', '花朵', '温柔', '婚礼', '玫瑰', 'rose', 'love', 'romance'] },
  { name: '数码蓝', hue: 224, keywords: ['科技', '人工智能', 'ai', '代码', '产品', '数字', '未来', '设计', 'design', 'tech', 'code'] },
  { name: '艺文紫', hue: 278, keywords: ['艺术', '展览', '电影', '摄影', '音乐', '书籍', '阅读', 'art', 'film', 'music', 'book'] },
  { name: '旧城金', hue: 38, keywords: ['复古', '历史', '建筑', '城市', '街道', '胶片', 'vintage', 'architecture'] },
  { name: '赛场绿', hue: 154, keywords: ['体育', '篮球', '足球', '比赛', '球员', '冠军', 'sport', 'basketball', 'football', 'game'] },
  { name: '资讯红', hue: 8, keywords: ['新闻', '快讯', '财经', '商业', '市场', '投资', '上市', 'ipo', 'news', 'finance'] },
];

const darkKeywords = ['深夜', '黑夜', '夜晚', '夜景', '暗色', '宇宙', '星空', '霓虹', 'night', 'dark', 'space', 'neon'];
const warmKeywords = ['温暖', '阳光', '秋日', '美食', '咖啡', '烘焙', '日落', 'sun', 'warm', 'sunset'];

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeHue(value) {
  return ((Number(value) % 360) + 360) % 360;
}

export function textHash(value) {
  let hash = 2166136261;
  for (const char of String(value || '')) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hueVector(hue, weight = 1) {
  const radians = normalizeHue(hue) * Math.PI / 180;
  return { x: Math.cos(radians) * weight, y: Math.sin(radians) * weight };
}

export function circularHueMean(entries, fallback = 0) {
  let x = 0;
  let y = 0;
  for (const entry of entries || []) {
    if (!Number.isFinite(entry?.hue) || !Number.isFinite(entry?.weight) || entry.weight <= 0) continue;
    const vector = hueVector(entry.hue, entry.weight);
    x += vector.x;
    y += vector.y;
  }
  if (Math.hypot(x, y) < .0001) return normalizeHue(fallback);
  return normalizeHue(Math.atan2(y, x) * 180 / Math.PI);
}

export function blendHue(primaryHue, accentHue, primaryWeight = .7) {
  return circularHueMean([
    { hue: primaryHue, weight: clamp(primaryWeight, 0, 1) },
    { hue: accentHue, weight: 1 - clamp(primaryWeight, 0, 1) },
  ], primaryHue);
}

export function rgbToHsl(red, green, blue) {
  const r = clamp(red, 0, 255) / 255;
  const g = clamp(green, 0, 255) / 255;
  const b = clamp(blue, 0, 255) / 255;
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
  return { hue: normalizeHue(hue), saturation: saturation * 100, lightness: lightness * 100 };
}

export function hslToRgb(hue, saturation, lightness) {
  const h = normalizeHue(hue) / 360;
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;
  if (!s) {
    const value = Math.round(l * 255);
    return { red: value, green: value, blue: value };
  }
  const q = l < .5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = offset => {
    let t = h + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    red: Math.round(channel(1 / 3) * 255),
    green: Math.round(channel(0) * 255),
    blue: Math.round(channel(-1 / 3) * 255),
  };
}

export function rgbToHex({ red, green, blue }) {
  return '#' + [red, green, blue].map(value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex) {
  const value = String(hex || '').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  return {
    red: parseInt(value.slice(0, 2), 16),
    green: parseInt(value.slice(2, 4), 16),
    blue: parseInt(value.slice(4, 6), 16),
  };
}

export function hslToHex(hue, saturation, lightness) {
  return rgbToHex(hslToRgb(hue, saturation, lightness));
}

function linearChannel(value) {
  const channel = value / 255;
  return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
}

export function relativeLuminance(color) {
  return .2126 * linearChannel(color.red) + .7152 * linearChannel(color.green) + .0722 * linearChannel(color.blue);
}

export function contrastRatio(first, second) {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

export function compositeColor(foreground, background, alpha) {
  const amount = clamp(alpha, 0, 1);
  return {
    red: foreground.red * amount + background.red * (1 - amount),
    green: foreground.green * amount + background.green * (1 - amount),
    blue: foreground.blue * amount + background.blue * (1 - amount),
  };
}

export function minimumSurfaceContrast(stops, surface, text) {
  const foreground = hexToRgb(text);
  if (!foreground) return 0;
  return Math.min(...stops.map(stop => {
    const background = hexToRgb(stop);
    return background ? contrastRatio(foreground, compositeColor(surface.color, background, surface.alpha)) : 0;
  }));
}

function containsKeyword(normalized, keyword) {
  if (!/^[a-z0-9]+$/i.test(keyword)) return normalized.includes(keyword);
  return new RegExp(`(^|[^a-z0-9])${keyword}($|[^a-z0-9])`, 'i').test(normalized);
}

function semanticForText(text) {
  const normalized = String(text || '').toLowerCase();
  const matches = semanticFamilies.map(family => ({
    ...family,
    score: family.keywords.reduce((score, keyword) => score + (containsKeyword(normalized, keyword) ? 1 : 0), 0),
  })).filter(family => family.score > 0);
  if (!matches.length) return null;
  const strongest = [...matches].sort((a, b) => b.score - a.score)[0];
  return {
    name: strongest.name,
    hue: circularHueMean(matches.map(match => ({ hue: match.hue, weight: match.score ** 1.35 })), strongest.hue),
    score: matches.reduce((sum, match) => sum + match.score, 0),
  };
}

export function summarizeImagePixels(pixels) {
  const buckets = Array.from({ length: 24 }, () => ({ x: 0, y: 0, saturation: 0, lightness: 0, score: 0, count: 0 }));
  let neutralRed = 0;
  let neutralGreen = 0;
  let neutralBlue = 0;
  let neutralCount = 0;
  for (let index = 0; index < (pixels?.length || 0); index += 4) {
    const alpha = pixels[index + 3];
    if (alpha < 160) continue;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const color = rgbToHsl(red, green, blue);
    if (color.lightness > 96 || color.lightness < 4) continue;
    neutralRed += red;
    neutralGreen += green;
    neutralBlue += blue;
    neutralCount += 1;
    if (color.saturation < 10) continue;
    const centerWeight = .35 + Math.max(0, 1 - Math.abs(color.lightness - 55) / 55);
    const score = (.18 + color.saturation / 100) ** 1.6 * centerWeight;
    const bucket = buckets[Math.floor(color.hue / 15) % buckets.length];
    const vector = hueVector(color.hue, score);
    bucket.x += vector.x;
    bucket.y += vector.y;
    bucket.saturation += color.saturation * score;
    bucket.lightness += color.lightness * score;
    bucket.score += score;
    bucket.count += 1;
  }
  const dominant = [...buckets].sort((a, b) => b.score - a.score)[0];
  if (dominant?.score > 0) {
    return {
      hue: normalizeHue(Math.atan2(dominant.y, dominant.x) * 180 / Math.PI),
      saturation: dominant.saturation / dominant.score,
      lightness: dominant.lightness / dominant.score,
      weight: clamp(dominant.score / Math.max(1, neutralCount) * 3, .35, 1.5),
    };
  }
  if (!neutralCount) return null;
  return {
    ...rgbToHsl(neutralRed / neutralCount, neutralGreen / neutralCount, neutralBlue / neutralCount),
    weight: .3,
  };
}

export function aggregateImageColors(colors) {
  const valid = (colors || []).filter(color => Number.isFinite(color?.hue) && Number.isFinite(color?.saturation));
  if (!valid.length) return null;
  const weighted = valid.map(color => ({
    ...color,
    normalizedWeight: clamp(color.weight || 1, .25, 1.5) * (.45 + clamp(color.saturation, 0, 100) / 180),
  }));
  const total = weighted.reduce((sum, color) => sum + color.normalizedWeight, 0);
  return {
    hue: circularHueMean(weighted.map(color => ({ hue: color.hue, weight: color.normalizedWeight })), weighted[0].hue),
    saturation: weighted.reduce((sum, color) => sum + color.saturation * color.normalizedWeight, 0) / total,
    lightness: weighted.reduce((sum, color) => sum + (color.lightness ?? 50) * color.normalizedWeight, 0) / total,
    count: valid.length,
  };
}

export function buildContentPalette({ title = '', description = '', url = '', platform = '', imageColors = [] } = {}) {
  const text = `${title} ${description}`.replace(/\s+/g, ' ').trim();
  const normalized = text.toLowerCase();
  const semantic = semanticForText(text);
  const image = aggregateImageColors(imageColors);
  const hash = textHash(text || url || platform || 'cardly');
  const fallbackHue = hash % 360;
  const primaryHue = semantic && image
    ? blendHue(semantic.hue, image.hue, .72)
    : semantic?.hue ?? image?.hue ?? fallbackHue;
  let accentHue = image?.hue ?? normalizeHue(primaryHue + 46 + (hash % 37));
  if (Math.abs(((accentHue - primaryHue + 540) % 360) - 180) < 12) {
    accentHue = normalizeHue(accentHue + (hash % 2 ? 32 : -32));
  }
  const bridgeHue = blendHue(primaryHue, accentHue, .56);
  const semanticStrength = clamp((semantic?.score || 0) * 4, 0, 16);
  const imageSaturation = image?.saturation ?? 44;
  const saturation = clamp(42 + semanticStrength + (imageSaturation - 42) * .28, 34, 68);
  const isDark = darkKeywords.some(keyword => normalized.includes(keyword));
  const isWarm = warmKeywords.some(keyword => normalized.includes(keyword));
  const shiftedPrimary = normalizeHue(primaryHue + (isWarm && !semantic ? 8 : 0));
  const stops = isDark
    ? [
        hslToHex(shiftedPrimary, saturation * .72, 14),
        hslToHex(bridgeHue, saturation * .62, 26),
        hslToHex(accentHue, saturation * .58, 42),
      ]
    : [
        hslToHex(shiftedPrimary, saturation * .72, 76),
        hslToHex(bridgeHue, saturation * .46, 91),
        hslToHex(accentHue, saturation * .60, 83),
      ];
  const surface = isDark
    ? { css: 'rgba(11,14,20,.88)', color: { red: 11, green: 14, blue: 20 }, alpha: .88 }
    : { css: 'rgba(255,255,255,.88)', color: { red: 255, green: 255, blue: 255 }, alpha: .88 };
  const candidates = isDark ? ['#f8fafc', '#111418'] : ['#111418', '#f8fafc'];
  const rankedText = candidates.map(textColor => ({
    textColor,
    contrast: minimumSurfaceContrast(stops, surface, textColor),
  })).sort((a, b) => b.contrast - a.contrast)[0];
  const imageCount = image?.count || 0;
  const reason = semantic && imageCount
    ? `融合“${semantic.name}”语义与 ${imageCount} 张图片`
    : semantic
      ? `识别到“${semantic.name}”内容语义`
      : imageCount
        ? `综合 ${imageCount} 张图片与正文`
        : '根据正文实时生成';
  return {
    name: semantic?.name || '内容色谱',
    stops,
    surface: surface.css,
    text: rankedText.textColor,
    dark: isDark,
    reason,
    primaryHue: normalizeHue(shiftedPrimary),
    accentHue: normalizeHue(accentHue),
    minimumContrast: rankedText.contrast,
    imageCount,
  };
}
