import assert from 'node:assert/strict';
import { estimateReadingMinutes, buildKicker } from '../reading-time.js';

assert.equal(estimateReadingMinutes('\u6d4b'.repeat(20)), 1, 'short Chinese');
assert.equal(estimateReadingMinutes('\u6d4b'.repeat(650)), 3, 'long Chinese');
assert.equal(estimateReadingMinutes(Array(221).fill('word').join(' ')), 2, 'English words');
assert.equal(buildKicker({ platform: 'x', description: 'short post' }), 'X POST \u00b7 1 MIN READ');
assert.equal(buildKicker({ platform: 'zhihu', description: 'summary', readingMinutes: 6 }), 'ZHIHU CONTENT \u00b7 6 MIN READ');
assert.equal(buildKicker({ platform: 'netease_music', description: 'artist album' }), 'MUSIC TRACK \u00b7 LIVE METADATA');
assert.equal(buildKicker({ platform: 'douyin', imageCount: 4 }), 'DOUYIN VIDEO \u00b7 4 MEDIA');
assert.equal(buildKicker({ platform: 'weibo', status: 'login_required' }), 'WEIBO POST \u00b7 ACCESS RESTRICTED');

console.log('PASS reading-time live labels');
