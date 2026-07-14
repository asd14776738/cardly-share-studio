# Cardly v37 Design QA

**Source visual truth path**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/before/01-mobile-initial-content.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/before/03-mobile-after-reload-default.png
- Existing Cardly v36 warm-neutral visual system, content hierarchy, and four-mode mobile workspace

**Implementation screenshot path**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/01-mobile-saving.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/02-mobile-saved.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/03-mobile-restored-after-reload.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/04-mobile-new-stays-clean.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/05-desktop-restored.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/responsive-360.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/responsive-760.png

**Viewport and state**

- Mobile flow: 390 × 844 for saving, saved, automatic reload restore, New, and History restore.
- Responsive boundaries: 360 × 900 and 760 × 900.
- Desktop: 1440 × 1000 after automatic restore.

**Full-view comparison evidence**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/v36-v37-comparison.jpg places v36 and v37 at the same 390 × 844 viewport. It proves the intended continuity change while showing that the surrounding hierarchy, source controls, form density, and topbar remain stable.

**Focused region comparison evidence**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/v37-status-focus.jpg shows the status pill at readable scale on desktop and mobile after the typography polish pass.

**Findings**

- No actionable P0, P1, or P2 findings remain in the final captured states.
- Accepted intentional difference: v37 adds a compact semantic status pill beside the Content heading. It is a functional trust signal, not visual drift.

**Required Fidelity Surfaces**

- Fonts and typography: passed. The existing Cardly sans/serif choices are preserved. Status text uses 11 px at both desktop and mobile, 650 weight, and one-line wrapping; title and form hierarchy remain unchanged.
- Spacing and layout rhythm: passed. The 26 px status pill aligns to the heading without shifting the source tabs or first input. New remains 48 × 40 px on mobile. No tested viewport clips or overflows.
- Colors and visual tokens: passed. Idle uses the existing warm-neutral surface; saving uses muted sand; saved/restored use restrained green; error uses muted red. No new saturated accent competes with the content.
- Image quality and asset fidelity: passed. Existing platform SVG assets and real content imagery remain unchanged. The feature introduces no placeholder art, emoji, CSS illustration, or raster degradation.
- Copy and content: passed. “本地自动保存”, “保存中…”, “已保存”, “已恢复上次编辑”, and “保存失败” map directly to real persistence states.
- Icons: passed. No icon family changes; the mobile New action remains text-only and the existing export asset remains optically aligned.
- States and interactions: passed. Idle, saving, saved, restored, New-clean, reload-clean, History restore, 360/390/760/1440, and failure-safe storage helpers are covered.
- Accessibility: passed for the tested scope. aria-live and aria-atomic expose status changes, aria-current marks the active History item, native buttons remain keyboard reachable, no visible target is under 40 px, and no horizontal overflow or console error remains.

**Primary interactions tested**

- Edit content and observe saving → saved
- Reload and restore content plus jade theme, portrait ratio, serif font, and 44 px padding
- New and reload without reopening the prior draft
- Restore the prior History item and switch mobile to Preview
- 360 / 390 / 760 / 1440 responsive measurements
- Complete adapter, reading-time, media-layout, palette, source-link, hashtag, platform-icon, history-store, and draft-session test suite

**Console errors checked**

- Final isolated Chrome run: none.

**Comparison history**

1. Baseline finding: reload returned the editor to the default example and gave no save-state feedback, forcing users to search History.
2. Functional fix: persistent active-draft pointer, automatic startup restore, semantic idle/saving/saved/restored/error copy, mobile New visibility, and active History state.
3. First visual comparison finding [P2]: the 9 px mobile status label was too small to carry a trust message comfortably.
4. Typography fix: increased status copy to 11 px at all tested widths and pill height to 26 px, while keeping the same muted token system.
5. Post-fix evidence: v37-status-focus.jpg and the final screenshots show the larger label without crowding; metrics report 92 × 26 px desktop size, no overflow, no sub-40 px interactive targets, and no console errors.

**Implementation Checklist**

- [x] Visible local save feedback
- [x] Persistent active-draft identity
- [x] Automatic reload restore without forced panel change
- [x] Mobile New action reachable
- [x] New and clear reset save state honestly
- [x] Active History semantics and visual treatment
- [x] 11 px readable status typography
- [x] Logic tests and isolated Chrome flow coverage
- [x] Same-viewport full and focused comparison evidence

**Follow-up Polish**

- P3: a future settings surface could explain local-only storage and device scope, but this is not required for the current compact workflow.

final result: passed
