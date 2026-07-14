import assert from 'node:assert/strict';
import { previewAssetState, summarizePreviewAssets } from '../export-readiness.js';

assert.equal(previewAssetState({ src: 'a.jpg', complete: false, naturalWidth: 0 }), 'pending');
assert.equal(previewAssetState({ src: 'a.jpg', complete: true, naturalWidth: 0 }), 'failed');
assert.equal(previewAssetState({ src: 'a.jpg', complete: true, naturalWidth: 1200 }), 'loaded');
assert.equal(previewAssetState({ src: '', complete: true, naturalWidth: 0 }), 'ignored');
assert.deepEqual(summarizePreviewAssets([
  { src: 'a.jpg', complete: true, naturalWidth: 1200 },
  { src: 'b.jpg', complete: false, naturalWidth: 0 },
]), { loaded: 1, pending: 1, failed: 0, ignored: 0, total: 2, ready: false });
assert.equal(summarizePreviewAssets([{ src: 'a.jpg', complete: true, naturalWidth: 1200 }]).ready, true);
console.log('Export readiness tests passed.');
