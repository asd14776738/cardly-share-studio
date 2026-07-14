import assert from 'node:assert/strict';
import { historyPlatformKey, historyFilterOptions, filterHistoryItems, historyMonth, groupHistoryByMonth } from '../history-view.js';

const entries = [
  { id: 'a', platform: 'instagram', updatedAt: new Date(2026, 6, 12).getTime() },
  { id: 'b', source: 'weibo', updatedAt: new Date(2026, 6, 2).getTime() },
  { id: 'c', platform: 'instagram', updatedAt: new Date(2026, 5, 20).getTime() },
];
assert.equal(historyPlatformKey(entries[1]), 'weibo');
assert.deepEqual(historyFilterOptions(entries), ['instagram', 'weibo']);
assert.deepEqual(filterHistoryItems(entries, 'instagram').map(item => item.id), ['a', 'c']);
assert.equal(historyMonth(entries[0].updatedAt).label, '2026年7月');
assert.deepEqual(groupHistoryByMonth(entries).map(group => [group.key, group.items.length]), [['2026-07', 2], ['2026-06', 1]]);
console.log('History view tests passed.');
