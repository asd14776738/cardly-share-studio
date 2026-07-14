export const ACTIVE_DRAFT_STORAGE_KEY = 'cardly-active-draft-id';

export const SAVE_STATUS_TEXT = Object.freeze({
  idle: '本地自动保存',
  saving: '保存中…',
  saved: '已保存',
  restored: '已恢复上次编辑',
  error: '保存失败',
});

export function saveStatusText(status) {
  return SAVE_STATUS_TEXT[status] || SAVE_STATUS_TEXT.idle;
}

export function readActiveDraftId(storage) {
  try {
    const value = storage?.getItem?.(ACTIVE_DRAFT_STORAGE_KEY);
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  } catch {
    return null;
  }
}

export function writeActiveDraftId(storage, id) {
  const value = typeof id === 'string' ? id.trim() : '';
  if (!value) return clearActiveDraftId(storage);
  try {
    storage?.setItem?.(ACTIVE_DRAFT_STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
}

export function clearActiveDraftId(storage) {
  try {
    storage?.removeItem?.(ACTIVE_DRAFT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
