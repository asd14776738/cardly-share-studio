import assert from 'node:assert/strict';
import { ACTIVE_DRAFT_STORAGE_KEY, saveStatusText, readActiveDraftId, writeActiveDraftId, clearActiveDraftId } from '../draft-session.js';

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const storage = new MemoryStorage();
assert.equal(readActiveDraftId(storage), null);
assert.equal(writeActiveDraftId(storage, ' card-37 '), true);
assert.equal(storage.getItem(ACTIVE_DRAFT_STORAGE_KEY), 'card-37');
assert.equal(readActiveDraftId(storage), 'card-37');
assert.equal(clearActiveDraftId(storage), true);
assert.equal(readActiveDraftId(storage), null);
assert.equal(saveStatusText('saving'), '保存中…');
assert.equal(saveStatusText('saved'), '已保存');
assert.equal(saveStatusText('restored'), '已恢复上次编辑');
assert.equal(saveStatusText('unknown'), '本地自动保存');
const throwingStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
assert.equal(readActiveDraftId(throwingStorage), null);
assert.equal(writeActiveDraftId(throwingStorage, 'x'), false);
assert.equal(clearActiveDraftId(throwingStorage), false);
console.log('Draft session tests passed.');
