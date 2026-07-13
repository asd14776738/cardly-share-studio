import assert from 'node:assert/strict';
import { estimateReadingMinutes, formatEngagementCount, buildKicker } from '../reading-time.js';

assert.equal(estimateReadingMinutes('\u6d4b'.repeat(20)), 1, 'short Chinese');
assert.equal(estimateReadingMinutes('\u6d4b'.repeat(650)), 3, 'long Chinese');
assert.equal(estimateReadingMinutes(Array(221).fill('word').join(' ')), 2, 'English words');
assert.equal(formatEngagementCount(58700), '5.9\u4e07', 'compact ten-thousands');
assert.equal(formatEngagementCount(203000000), '2\u4ebf', 'compact hundred-millions');
assert.equal(buildKicker({ platform: 'x', description: 'short post' }), '', 'hide missing social metric');
assert.equal(buildKicker({ platform: 'zhihu', metricType: 'likes', metricCount: 12600 }), '1.3\u4e07 \u6b21\u70b9\u8d5e');
assert.equal(buildKicker({ platform: 'netease_music', description: 'artist album' }), 'MUSIC TRACK \u00b7 LIVE METADATA');
assert.equal(buildKicker({ platform: 'douyin', metricType: 'views', metricCount: 58700 }), '5.9\u4e07 \u6b21\u6d4f\u89c8');
assert.equal(buildKicker({ platform: 'weibo', status: 'login_required' }), '', 'never fabricate restricted metrics');

console.log('PASS reading-time live labels');
