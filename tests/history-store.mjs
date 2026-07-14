import assert from 'node:assert/strict';
import { HISTORY_LIMIT, createHistorySnapshot, normalizeHistoryItems, formatHistoryTime } from '../history-store.js';
const now = Date.UTC(2026, 6, 14, 2, 0, 0);
const snapshot = createHistorySnapshot({ title:'真实作品', description:'正文', images:['data:image/png;base64,abc','https://example.com/a.jpg'], source:'web', ratio:'portrait' }, { id:'card-1', now });
assert.equal(snapshot.id,'card-1');assert.equal(snapshot.images.length,2);assert.equal(snapshot.image,snapshot.images[0]);assert.equal(snapshot.ratio,'portrait');
const items=Array.from({length:HISTORY_LIMIT+3},(_,i)=>({id:'id-'+i,title:'T'+i,updatedAt:now-i}));assert.equal(normalizeHistoryItems(items).length,HISTORY_LIMIT);assert.equal(normalizeHistoryItems([items[2],items[0],items[1]])[0].id,'id-0');
assert.equal(formatHistoryTime(now-20_000,now),'刚刚');assert.equal(formatHistoryTime(now-5*60_000,now),'5 分钟前');
console.log('History store tests passed.');
