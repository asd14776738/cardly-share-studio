import assert from 'node:assert/strict';
import { chooseMediaLayout, buildAutoMediaLayout } from '../media-layout.js';

const dogSet = [
  { width: 1200, height: 900 },
  { width: 1200, height: 900 },
  { width: 1000, height: 1000 },
  { width: 1600, height: 800 },
];
const featured = chooseMediaLayout(dogSet);
assert.equal(featured.type, 'featured');
assert.equal(featured.columns, 3);
assert.equal(featured.heroIndex, 3);
const featuredCanvas = buildAutoMediaLayout(dogSet, 888, 18);
assert.equal(featuredCanvas.cells.length, 4);
assert.deepEqual(featuredCanvas.cells.slice(0, 3).map(cell => [cell.width, cell.height]), [[284, 284], [284, 284], [284, 284]]);
assert.equal(featuredCanvas.cells[3].width, 888);
assert.equal(featuredCanvas.cells[3].height, 296);
assert.equal(featuredCanvas.height, 598);

const portraitGrid = chooseMediaLayout(Array.from({ length: 4 }, () => ({ width: 800, height: 1200 })));
assert.equal(portraitGrid.type, 'grid-2');
assert.equal(portraitGrid.portrait, true);
const portraitCanvas = buildAutoMediaLayout(Array.from({ length: 4 }, () => ({ width: 800, height: 1200 })), 888, 18);
assert.equal(portraitCanvas.cells[0].height, 522);
assert.equal(portraitCanvas.cells[2].y, 540);

const pair = buildAutoMediaLayout([{ width: 1200, height: 900 }, { width: 1200, height: 900 }], 888, 18);
assert.equal(pair.type, 'pair');
assert.equal(pair.cells.length, 2);
assert.equal(pair.height, 435);

console.log('PASS automatic media layout');
