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

const seven = [
  ...Array.from({ length: 6 }, () => ({ width: 1000, height: 1000 })),
  { width: 1600, height: 900 },
];
const sevenPlan = chooseMediaLayout(seven);
assert.equal(sevenPlan.type, 'featured');
assert.equal(sevenPlan.columns, 3);
assert.equal(sevenPlan.heroIndex, 6);
const sevenCanvas = buildAutoMediaLayout(seven, 888, 18);
assert.equal(sevenCanvas.cells.length, 7);
assert.deepEqual(sevenCanvas.cells.slice(0, 6).map(cell => [cell.width, cell.height]), Array.from({ length: 6 }, () => [284, 284]));
assert.deepEqual([sevenCanvas.cells[6].x, sevenCanvas.cells[6].y, sevenCanvas.cells[6].width, sevenCanvas.cells[6].height], [0, 604, 888, 296]);
assert.equal(sevenCanvas.height, 900);

const eight = Array.from({ length: 8 }, () => ({ width: 1000, height: 1000 }));
const eightPlan = chooseMediaLayout(eight);
assert.equal(eightPlan.type, 'balanced');
assert.deepEqual(eightPlan.wideIndices, [6, 7]);
const eightCanvas = buildAutoMediaLayout(eight, 888, 18);
assert.equal(eightCanvas.cells.length, 8);
assert.deepEqual(eightCanvas.cells.slice(-2).map(cell => [cell.width, cell.height]), [[435, 284], [435, 284]]);
assert.equal(eightCanvas.height, 888);

for (let count = 1; count <= 12; count += 1) {
  const items = Array.from({ length: count }, (_, index) => ({ width: index === count - 1 ? 1600 : 1000, height: 1000 }));
  const layout = buildAutoMediaLayout(items, 888, 18);
  assert.equal(layout.cells.length, count, `layout should include every image for count ${count}`);
  assert.ok(layout.cells.every(cell => cell.x >= 0 && cell.y >= 0 && cell.x + cell.width <= 889), `layout should stay inside the frame for count ${count}`);
}

console.log('PASS automatic media layout');
