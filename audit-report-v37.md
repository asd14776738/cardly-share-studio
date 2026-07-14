# Cardly v37 Product Design Audit

## Overall Verdict

The editing flow now behaves like a trustworthy creative workspace: the interface reports local save state, reload restores the exact active draft and styling in place, New creates a clean starting point, and History remains the explicit archive. The compact status treatment follows the existing warm-neutral visual system instead of adding a competing notification layer.

## Numbered Flow Steps

1. **Open the workspace — healthy.** The Content heading shows “本地自动保存” without displacing the title, primary input, or source tabs. The status is secondary but readable at desktop and mobile widths.
2. **Edit content or styling — healthy.** The status changes immediately to “保存中…” and settles on “已保存” after the 700 ms idle window. The active work receives one persistent History ID instead of creating duplicates.
3. **Reload during an active draft — healthy.** Title, body, theme, ratio, font, padding, images, source, and author are restored from IndexedDB. Mobile stays in Content so the user can continue where they stopped; no extra History search is required.
4. **Start a new work — healthy.** New is reachable on mobile with a 48 × 40 px target. It clears the active-draft pointer, restores the default editing state, and immediately returns the label to “本地自动保存”.
5. **Reload after New — healthy.** The clean default remains clean; the previous draft is still available in History but is not silently reopened.
6. **Restore from History — healthy.** Activating the prior item marks it current, restores all content and styling, reports “已恢复上次编辑”, and switches mobile users to Preview for an immediate visible result.
7. **Responsive and console check — healthy.** 360, 390, 760, and 1440 px states have zero horizontal overflow, no visible interactive target below 40 px, and no console or page errors in the final run.

## Measured Change

- Save feedback: none → idle, saving, saved, restored, and error states.
- Reload continuity: default example after reload → exact active draft and styling restored.
- Steps required to resume after reload: open History and locate the item → zero.
- Mobile clean-start action: hidden → visible 48 × 40 px New control.
- Misleading status after New: “已恢复上次编辑” → “本地自动保存”.
- Horizontal overflow at 360 / 390 / 760 / 1440 px: 0 px.
- Visible interactive targets below 40 px: 0.
- Console errors in the final run: 0.

## UX and Accessibility Findings

- No actionable P0, P1, or P2 findings remain in the tested flow.
- The save status uses a polite live region and atomic text updates, so state changes are exposed beyond color alone.
- The active History item uses aria-current and a restrained focus-like ring without changing the card layout.
- A first visual pass found the mobile status copy too small at 9 px. It was increased to 11 px with a 26 px pill height, then re-captured at the same states and widths.

## Evidence

- Before/after flow comparison: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/v36-v37-comparison.jpg
- Final flow contact sheet: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/v37-contact-sheet.jpg
- Focused status comparison: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/v37-status-focus.jpg
- Saving: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/01-mobile-saving.png
- Saved: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/02-mobile-saved.png
- Reload restored: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/03-mobile-restored-after-reload.png
- New stays clean: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/04-mobile-new-stays-clean.png
- Desktop restored: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/05-desktop-restored.png
- Interaction metrics: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/metrics.json
- Responsive metrics: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v37/after/responsive-metrics.json

## Evidence Limits

The run proves browser-rendered state changes, persistence, responsive reflow, target sizes, page identity, and console health in isolated Chrome. It does not claim full WCAG conformance, screen-reader announcement timing across every assistive technology, or persistence in private modes where browser storage is disabled. The explicit “保存失败” state remains the fallback for unavailable storage.
