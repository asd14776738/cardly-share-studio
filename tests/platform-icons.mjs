import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const build = await readFile(new URL('../build.mjs', import.meta.url), 'utf8');
const expected = ['apple', 'chatgpt', 'douban', 'douyin', 'instagram', 'kimi', 'netease', 'qqmusic', 'spotify', 'telegram', 'threads', 'web', 'wechat', 'weibo', 'x', 'xiaohongshu', 'zhihu'];

const jike = app.match(/jike:\s*'data:image\/png;base64,([^']+)'/);
assert.ok(jike, 'Jike should use an embedded PNG');
const bytes = Buffer.from(jike[1], 'base64');
assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
assert.ok(bytes.length > 1000, 'Jike icon must contain the official image data');

assert.doesNotMatch(app + html, /cdn\.simpleicons\.org|google\.com\/s2\/favicons/, 'platform icons must not depend on external icon services');
assert.match(app, /return platformIcons\.web;/, 'generic web icon should be local and stable');
assert.match(html, /data-platform-icon="jike"/, 'Jike support chip should use embedded image data');
assert.match(app, /qsa\('\[data-platform-icon\]'\)/, 'embedded platform icons should hydrate at startup');
assert.match(build, /readdir\('assets\/icons'\)/, 'build should include local platform SVG files');

for (const name of expected) {
  const svg = await readFile(new URL('../assets/icons/' + name + '.svg', import.meta.url), 'utf8');
  assert.match(svg, /^<svg[\s>]/, name + ' should be a valid local SVG');
  assert.match(svg, /<title>[^<]+<\/title>/, name + ' should have an accessible title');
  assert.match(app + html, new RegExp('/assets/icons/' + name + '\\.svg'), name + ' should be referenced');
}

console.log('Platform icon tests passed.');
