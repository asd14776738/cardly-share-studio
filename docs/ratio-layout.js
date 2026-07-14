const FIXED_RATIO_PLANS = {
  square: { titleLines: 2, descriptionLines: 2, mediaMin: 150, mediaFit: 'cover' },
  portrait: { titleLines: 3, descriptionLines: 5, mediaMin: 240, mediaFit: 'cover' },
  wide: { titleLines: 2, descriptionLines: 4, mediaMin: 96, mediaFit: 'cover' },
};

export function fixedRatioPlan(ratio, { mediaCount = 0, density = 'short' } = {}) {
  const base = FIXED_RATIO_PLANS[ratio];
  if (!base) return null;
  const descriptionLines = density === 'long'
    ? Math.max(2, base.descriptionLines - 2)
    : density === 'medium'
      ? Math.max(2, base.descriptionLines - 1)
      : base.descriptionLines;
  return {
    ...base,
    descriptionLines,
    mediaMin: mediaCount > 0 ? base.mediaMin : 0,
  };
}
