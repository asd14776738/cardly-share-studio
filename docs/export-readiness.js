export function previewAssetState(asset) {
  const src = String(asset?.currentSrc || asset?.src || '');
  if (!src) return 'ignored';
  if (asset.complete !== true) return 'pending';
  return Number(asset.naturalWidth || 0) > 0 ? 'loaded' : 'failed';
}

export function summarizePreviewAssets(assets = []) {
  const counts = { loaded: 0, pending: 0, failed: 0, ignored: 0 };
  for (const asset of assets) counts[previewAssetState(asset)] += 1;
  return {
    ...counts,
    total: counts.loaded + counts.pending + counts.failed,
    ready: counts.pending === 0 && counts.failed === 0,
  };
}
