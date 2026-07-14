# Cardly v36 Design QA

**Source visual truth path**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/01-mobile-history-fixtures.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/02-mobile-after-restore-click.png
- Existing Cardly v35 warm-neutral visual system and four-mode mobile workspace

**Implementation screenshot path**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/01-mobile-empty-history.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/02-mobile-real-history.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/03-mobile-restored-preview.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/04-mobile-persisted-after-reload.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/05-mobile-clear-confirm.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/06-mobile-cleared.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/07-desktop-real-history.png

**Viewport and state**

- Mobile: 390 × 844 for empty, saved, restored, persisted, clear-confirm, and cleared states.
- Responsive metrics: 360 × 800, 390 × 844, 760 × 900, and 1440 × 1000.
- Desktop visual capture: 1440 × 1000 with one real history item.

**Full-view comparison evidence**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/before-after-comparison.jpg places the two baseline mobile History states beside the real saved and restored states at the same 390 × 844 viewport.
- Intentional content difference: hardcoded fixtures are removed by design; the comparison checks hierarchy, surface treatment, density, navigation, and visible restore feedback rather than pixel-identical content.

**Focused region comparison evidence**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/focused-history-comparison.jpg compares the History header and first card region. The implementation preserves the existing warm-neutral frame while replacing generic labels with actual source, relative time, author, title, and image.

**Findings**

- No actionable P0, P1, or P2 findings remain in the captured states.
- Accepted constraint: a single desktop item occupies the first track of the three-column recent grid; this preserves predictable alignment as the history grows and is not a broken empty column state.

**Required Fidelity Surfaces**

- Fonts and typography: passed. Existing Cardly font stacks are preserved. History metadata is optically secondary, the title remains the primary scan target, two-line truncation prevents card growth, and the clear-confirm copy does not disturb hierarchy.
- Spacing and layout rhythm: passed. Mobile cards use a stable text/image split, 14 px radius, and 20 px inset; 360–760 px widths reflow without clipping. Desktop retains the existing three-track rhythm.
- Colors and visual tokens: passed. Each saved item uses its actual theme stops and text token. Empty and destructive-confirm states use the existing warm-neutral and muted-red system without introducing a competing accent.
- Image quality and asset fidelity: passed. The first real content image is used with object-fit cover and a bounded crop; platform icons are existing source assets, not placeholders or generated approximations. Failed thumbnails degrade to a text-only card.
- Copy and content: passed. “自动保存，随时回到上次编辑”, “已恢复”, and the two-step clear wording describe real behavior and replace the misleading fixture interface.
- States and interactions: passed. Empty, autosaved, restored, persisted-after-reload, confirm-clear, cleared, desktop, and keyboard-restore states were exercised.
- Accessibility: passed for the tested scope. No visible target below 40 px, no horizontal overflow, native button semantics restore with Enter, reduced-motion handling remains intact, and the final run reports no console errors.

**Primary interactions tested**

- Autosave after content/style edits
- Restoring all saved content and style state
- Mobile History → Preview transition
- IndexedDB persistence across reload
- Two-step clear confirmation
- Native Enter-key activation
- 360 / 390 / 760 / 1440 responsive measurements
- Complete existing adapter, media-layout, palette, source-link, hashtag, icon, and new history-store test suite

**Console errors checked**

- Final browser capture: none.

**Comparison history**

1. Baseline: three fake cards and no visible mobile result after activation.
2. Fixes: real IndexedDB records, actual saved metadata and imagery, mobile restore-to-Preview, honest empty state, persistent reload behavior, and two-step clearing.
3. Polish pass: suppressed the obsolete pseudo-empty copy and added an inline favicon to remove the only local 404.
4. Post-fix evidence: the current-run comparison boards show the new card hierarchy and visible restoration; metrics prove persistence, keyboard restoration, no sub-40 px targets, no overflow, and no console errors.

**Implementation Checklist**

- [x] Remove fixture history
- [x] Persist real content and styling
- [x] Update active record without duplicates
- [x] Use actual source icon, palette, timestamp, author, title, and image
- [x] Restore directly into mobile Preview
- [x] Persist across reload
- [x] Two-step destructive action
- [x] Keyboard and responsive checks
- [x] Automated history-store tests
- [x] Current-run full and focused comparison evidence

**Follow-up Polish**

- P3: when users accumulate many works, optional search or source filters can be added without changing the current card model.

final result: passed
