const trackingParameters = new Set([
  'igsh', 'igshid', 'spm', 'from', 'share_source', 'share_medium',
  'share_app_id', 'share_item_id', 'share_link_id', 'timestamp',
]);

function isTrackingParameter(name) {
  const normalized = String(name || '').toLowerCase();
  return normalized.startsWith('utm_') || trackingParameters.has(normalized);
}

function shortenMiddle(value, maxLength) {
  if (value.length <= maxLength) return value;
  const tailLength = Math.min(10, Math.floor(maxLength * .24));
  const headLength = Math.max(10, maxLength - tailLength - 1);
  return `${value.slice(0, headLength)}…${value.slice(-tailLength)}`;
}

export function formatSourceLink(value, maxLength = 52) {
  try {
    const url = new URL(String(value || '').trim());
    if (!['http:', 'https:'].includes(url.protocol)) return { href: '', display: '' };
    for (const name of [...url.searchParams.keys()]) {
      if (isTrackingParameter(name)) url.searchParams.delete(name);
    }
    url.hash = '';
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    let path = url.pathname === '/' ? '' : decodeURIComponent(url.pathname).replace(/\/$/, '');
    const query = url.searchParams.toString();
    let display = host + path + (query ? `?${query}` : '');
    display = shortenMiddle(display, Math.max(24, maxLength));
    return { href: url.href, display };
  } catch {
    return { href: '', display: '' };
  }
}
