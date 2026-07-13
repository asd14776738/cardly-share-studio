const hashtagPattern = /#\s*([\p{L}\p{N}_-]{1,40})(?:\[话题\]#)?(?=\s|#|$|[，。！？、,.!?;；:：])/gu;

function normalizeBody(value) {
  return String(value || '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([，。！？、,.!?;；:：])/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function splitHashtags(value) {
  const hashtags = [];
  const seen = new Set();
  const text = String(value || '').replace(hashtagPattern, (_, label) => {
    const clean = String(label || '').trim();
    const key = clean.toLocaleLowerCase();
    if (clean && !seen.has(key)) {
      seen.add(key);
      hashtags.push('#' + clean);
    }
    return ' ';
  });
  return { text: normalizeBody(text), hashtags };
}

export function mergeHashtags(...groups) {
  const merged = [];
  const seen = new Set();
  for (const group of groups) {
    for (const tag of group || []) {
      const key = String(tag || '').toLocaleLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(tag);
    }
  }
  return merged;
}
