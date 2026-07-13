import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const match = app.match(/jike:\s*'data:image\/png;base64,([^']+)'/);
assert.ok(match, 'Jike should use an embedded PNG');
const bytes = Buffer.from(match[1], 'base64');
assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
assert.ok(bytes.length > 1000, 'Jike icon must contain the official image data');
assert.doesNotMatch(app.match(/jike:\s*[^\n]+/)[0], /google\.com\/s2\/favicons/);
console.log('Platform icon tests passed.');
