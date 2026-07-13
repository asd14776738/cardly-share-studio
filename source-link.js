const trackingParameters = new Set([
  'igsh', 'igshid', 'spm', 'from', 'share_source', 'share_medium',
  'share_app_id', 'share_item_id', 'share_link_id', 'timestamp',
]);

function isTrackingParameter(name) {
  const normalized = String(name || '').toLowerCase();
  return normalized.startsWith('utm_') || trackingParameters.has(normalized);
}

export function formatSourceLink(value) {
  try {
    const url = new URL(String(value || '').trim());
    if (!['http:', 'https:'].includes(url.protocol)) return { href: '', display: '' };
    for (const name of [...url.searchParams.keys()]) {
      if (isTrackingParameter(name)) url.searchParams.delete(name);
    }
    url.hash = '';
    url.username = '';
    url.password = '';
    const href = url.href;
    return { href, display: href };
  } catch {
    return { href: '', display: '' };
  }
}
