export function estimateReadingMinutes(text) {
  const value = String(text || '').trim();
  const hanCharacters = (value.match(/[\u3400-\u9fff]/g) || []).length;
  const latinWords = (value.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+(?:['\u2019-][A-Za-z0-9]+)*/g) || []).length;
  return Math.max(1, Math.ceil(hanCharacters / 300 + latinWords / 220));
}

export function formatEngagementCount(value) {
  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return '';
  const compact = (number, unit) => {
    const rounded = number >= 100 ? Math.round(number) : Math.round(number * 10) / 10;
    return String(rounded).replace(/\.0$/, '') + unit;
  };
  if (count >= 100000000) return compact(count / 100000000, '\u4ebf');
  if (count >= 10000) return compact(count / 10000, '\u4e07');
  return Math.round(count).toLocaleString('zh-CN');
}

const kickerKinds = {
  web: 'ARTICLE',
  x: 'X POST',
  weibo: 'WEIBO POST',
  wechat: 'WECHAT ARTICLE',
  zhihu: 'ZHIHU CONTENT',
  xiaohongshu: 'RED NOTE',
  jike: 'JIKE POST',
  telegram: 'CHANNEL POST',
  instagram: 'INSTAGRAM POST',
  threads: 'THREADS POST',
  douban: 'DOUBAN CONTENT',
  douyin: 'DOUYIN VIDEO',
  netease_music: 'MUSIC TRACK',
  qq_music: 'MUSIC TRACK',
  apple_music: 'MUSIC TRACK',
  spotify: 'MUSIC TRACK',
  chatgpt: 'CONVERSATION',
  kimi: 'CONVERSATION',
};

export function buildKicker({ platform = 'web', status = 'ok', readingMinutes, description = '', metricType = '', metricCount = null }) {
  const kind = kickerKinds[platform] || 'PUBLIC CONTENT';
  const socialPlatforms = ['x', 'weibo', 'xiaohongshu', 'jike', 'telegram', 'instagram', 'threads', 'douyin', 'zhihu'];
  const metric = formatEngagementCount(metricCount);
  if (socialPlatforms.includes(platform)) {
    if (metric && metricType === 'views') return metric + ' \u6b21\u6d4f\u89c8';
    if (metric && metricType === 'likes') return metric + ' \u6b21\u70b9\u8d5e';
    return '';
  }
  if (status === 'login_required') return kind + ' \u00b7 ACCESS RESTRICTED';
  if (['netease_music', 'qq_music', 'apple_music', 'spotify'].includes(platform)) return kind + ' \u00b7 LIVE METADATA';
  if (!String(description).trim()) {
    return kind + ' \u00b7 NO PUBLIC TEXT';
  }
  const minutes = Number.isFinite(readingMinutes) ? readingMinutes : estimateReadingMinutes(description);
  return kind + ' \u00b7 ' + minutes + ' MIN READ';
}
