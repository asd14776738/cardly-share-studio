# Cardly v28 Design QA

- Source visual truth: `../audit-v28/reference-7-image-layout.png`
- Rendered implementation: `../audit-v28/browser-7-card.png`
- Focused implementation crop: `../audit-v28/browser-gallery.png`
- Full-view comparison: `../audit-v28/comparison.png`
- Focused comparison: `../audit-v28/gallery-comparison.jpg`
- Desktop viewport: 1440 x 1100
- Mobile viewport: 390 x 844
- State: automatic ratio, seven-image social post, editorial card layout
- Browser: isolated Chrome CDP fallback because the in-app browser tool was unavailable

**Findings**

- No remaining P0, P1, or P2 mismatch in the scoped media-gallery composition.
- The reference uses six equal square thumbnails in a 3 x 2 grid followed by one full-width 3:1 hero. Cardly now uses the same composition.
- Desktop geometry: six 131 x 131 thumbnails, 8 px gaps, and one 410 x 137 hero.
- Mobile geometry: six 84 x 84 thumbnails, 8 px gaps, and one 268 x 89 hero.
- No horizontal overflow was found at either viewport.

**Required Fidelity Surfaces**

- Fonts and typography: card typography is unchanged; the scoped media-grid change introduces no wrapping or hierarchy regression.
- Spacing and layout rhythm: gallery gaps are consistently 8 px, all grid columns align, and no incomplete row leaves a blank region.
- Colors and visual tokens: existing Cardly theme tokens are preserved.
- Image quality and asset fidelity: source images remain real raster assets; thumbnails use intentional cover crops and the hero uses a wide crop matching the reference.
- Copy and content: unchanged.

**Primary Interactions Tested**

- Uploaded seven images through the real file-input flow.
- Confirmed automatic layout selection after image decoding.
- Confirmed desktop and mobile responsive geometry.
- Confirmed the same layout planner is exercised by PNG export unit coverage.
- Browser console exceptions checked: none.

**Comparison History**

1. Initial issue (P1): seven images rendered as a 3-column grid with a single orphan tile in the last row, leaving a large blank area.
2. Fix: added a remainder-aware featured layout. Counts 7 and 10 render complete 3-column rows plus a full-width hero; counts 8 and 11 render complete rows plus two balanced wide tiles.
3. Post-fix evidence: `../audit-v28/gallery-comparison.jpg` shows the reference and implementation with the same 3 x 2 + hero hierarchy. Desktop and mobile geometry checks show no overflow.

**Implementation Checklist**

- [x] Match the seven-image reference composition.
- [x] Eliminate orphan rows for image counts 1 through 12.
- [x] Keep preview and PNG export on the same layout planner.
- [x] Verify desktop and mobile layouts.
- [x] Verify console errors.
- [x] Add regression tests.

**Follow-up Polish**

- None required for this scope.

final result: passed
