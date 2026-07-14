export function historyPlatformKey(entry) {
  return String(entry?.platform || entry?.source || 'web').trim() || 'web';
}

export function historyFilterOptions(entries = []) {
  const seen = new Set();
  return entries.reduce((options, entry) => {
    const key = historyPlatformKey(entry);
    if (!seen.has(key)) {
      seen.add(key);
      options.push(key);
    }
    return options;
  }, []);
}

export function filterHistoryItems(entries = [], filter = 'all') {
  return filter === 'all' ? [...entries] : entries.filter(entry => historyPlatformKey(entry) === filter);
}

export function historyMonth(timestamp) {
  const date = new Date(Number(timestamp));
  if (!Number.isFinite(date.getTime())) return { key: 'unknown', label: '更早' };
  return {
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    label: `${date.getFullYear()}年${date.getMonth() + 1}月`,
  };
}

export function groupHistoryByMonth(entries = []) {
  const groups = [];
  const byKey = new Map();
  for (const entry of entries) {
    const month = historyMonth(entry?.updatedAt);
    let group = byKey.get(month.key);
    if (!group) {
      group = { ...month, items: [] };
      groups.push(group);
      byKey.set(month.key, group);
    }
    group.items.push(entry);
  }
  return groups;
}
