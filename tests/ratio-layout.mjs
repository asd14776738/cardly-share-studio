import assert from 'node:assert/strict';
import { fixedRatioPlan } from '../ratio-layout.js';

assert.equal(fixedRatioPlan('auto'), null);
assert.deepEqual(fixedRatioPlan('square', { mediaCount: 1, density: 'short' }), {
  titleLines: 2,
  descriptionLines: 2,
  mediaMin: 150,
  mediaFit: 'cover',
});
assert.equal(fixedRatioPlan('portrait', { mediaCount: 1, density: 'long' }).descriptionLines, 3);
assert.equal(fixedRatioPlan('portrait', { mediaCount: 0 }).mediaMin, 0);
assert.equal(fixedRatioPlan('wide', { mediaCount: 1 }).mediaFit, 'cover');
console.log('Ratio layout tests passed.');
