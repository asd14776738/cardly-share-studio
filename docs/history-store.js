export const HISTORY_LIMIT = 12;

const snapshotFields = [
  'source','platform','contentStatus','readingMinutes','metricType','metricCount','colorMode','sourceLabel',
  'ratio','layout','theme','font','radius','padding','url','title','description','author','image','icon','dynamicTheme'
];

export function createHistorySnapshot(state, { id, now = Date.now() } = {}) {
  const snapshot = {
    id: id || `card-${now}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Number(state.createdAt) || now,
    updatedAt: now,
    images: Array.isArray(state.images) ? state.images.filter(value => typeof value === 'string' && value).slice(0, 12) : [],
  };
  snapshotFields.forEach(field => {
    const value = state[field];
    if (value !== undefined && value !== null) snapshot[field] = value;
  });
  if (!snapshot.image && snapshot.images.length) snapshot.image = snapshot.images[0];
  return snapshot;
}

export function normalizeHistoryItems(items, limit = HISTORY_LIMIT) {
  const seen = new Set();
  return (Array.isArray(items) ? items : [])
    .filter(item => item && typeof item.id === 'string' && item.id && typeof item.title === 'string')
    .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .filter(item => seen.has(item.id) ? false : (seen.add(item.id), true))
    .slice(0, limit);
}

export function formatHistoryTime(timestamp, now = Date.now()) {
  const value = Number(timestamp);
  if (!Number.isFinite(value)) return '';
  const delta = Math.max(0, now - value);
  if (delta < 60_000) return '刚刚';
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} 分钟前`;
  const date = new Date(value), current = new Date(now);
  if (date.toDateString() === current.toDateString()) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (date.getFullYear() === current.getFullYear()) return `${date.getMonth() + 1}月${date.getDate()}日`;
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}
