import assert from 'node:assert/strict';
import { formatSourceLink } from '../source-link.js';

const instagram = formatSourceLink('https://www.instagram.com/p/DacpRzeMiMA/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==');
assert.equal(instagram.display, 'instagram.com/p/DacpRzeMiMA');
assert.equal(instagram.href, 'https://www.instagram.com/p/DacpRzeMiMA/');

const meaningfulQuery = formatSourceLink('https://example.com/read?id=42&utm_medium=social');
assert.equal(meaningfulQuery.display, 'example.com/read?id=42');
assert.equal(meaningfulQuery.href, 'https://example.com/read?id=42');

const long = formatSourceLink('https://example.com/a/very/long/path/that/should/not/overpower/the/footer/123456789', 42);
assert.ok(long.display.length <= 42);
assert.match(long.display, /…/);
assert.ok(long.display.endsWith('123456789'));

assert.deepEqual(formatSourceLink('javascript:alert(1)'), { href: '', display: '' });
console.log('Source link tests passed.');
