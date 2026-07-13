import assert from 'node:assert/strict';
import { formatSourceLink } from '../source-link.js';

const instagram = formatSourceLink('https://www.instagram.com/p/DacpRzeMiMA/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==');
assert.equal(instagram.display, 'https://www.instagram.com/p/DacpRzeMiMA/');
assert.equal(instagram.href, instagram.display);

const meaningfulQuery = formatSourceLink('https://example.com/read?id=42&utm_medium=social');
assert.equal(meaningfulQuery.display, 'https://example.com/read?id=42');
assert.equal(meaningfulQuery.href, meaningfulQuery.display);

const long = formatSourceLink('https://example.com/a/very/long/path/that/should/remain/copyable/without/a/fake/ellipsis/123456789');
assert.doesNotMatch(long.display, /…/);
assert.equal(new URL(long.display).href, long.href);
assert.ok(long.display.endsWith('123456789'));

const encoded = formatSourceLink('https://example.com/路径?keyword=中文#section');
assert.equal(new URL(encoded.display).href, encoded.href);
assert.equal(new URL(encoded.display).hash, '');

assert.deepEqual(formatSourceLink('javascript:alert(1)'), { href: '', display: '' });
console.log('Source link tests passed.');
