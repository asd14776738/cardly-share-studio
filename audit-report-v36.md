# Cardly v36 Product Design Audit

## Overall Verdict

History is now an honest continuation surface instead of a decorative fixture gallery. A real edit produces one persistent work item; the item carries the actual source, relative time, title, author, first image, and saved theme, and restores the complete editable card. Mobile restoration now switches directly to Preview, fixing the previous no-visible-result path.

## Numbered Flow Steps

1. **Open History before creating anything — healthy.** The three hardcoded fixture cards are gone. The user sees one calm empty state explaining when work will appear; Clear is hidden while there is nothing to remove.
2. **Edit a card and wait for autosave — healthy.** Title, body, author, source, images, theme, ratio, layout, typography, radius, and spacing are captured into one IndexedDB record after a 700 ms idle window. Repeated edits update the active record instead of producing duplicates.
3. **Review the saved work item — healthy.** The card uses the saved palette and a real platform icon, relative timestamp, author/source label, title, and first image. The 390 px mobile card remains legible at 354 × 161 px with no horizontal overflow.
4. **Restore the saved work item — healthy.** Activating the card restores content and style controls, reports “已恢复”, and switches mobile users from History to Preview so the result is immediately visible.
5. **Reload the browser — healthy.** The same work item and title remain after navigation, proving the history is persistent rather than session-only markup.
6. **Clear history — healthy.** The first activation changes the action to “再次点击清空” without deleting data; the second clears IndexedDB and returns to the empty state.
7. **Responsive and keyboard check — healthy.** 360, 390, 760, and 1440 px states have zero horizontal overflow and zero visible interactive targets below 40 px. The native history button restores the item with Enter and exposes the result in Preview.

## Measured Change

- Hardcoded recent items: 3 → 0.
- Visible response after mobile restore: none → Preview with restored content and status.
- Persistence after reload: none → 1 real work item retained.
- Accidental one-click clearing: possible → two-step confirmation.
- Horizontal overflow at 360 / 390 / 760 / 1440 px: 0 px.
- Visible targets below 40 px in tested states: 0.
- Console errors in the final run: 0.

## Evidence

- Full before/after comparison: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/before-after-comparison.jpg
- Focused History comparison: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/focused-history-comparison.jpg
- Empty state: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/01-mobile-empty-history.png
- Real autosaved work: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/02-mobile-real-history.png
- Restored Preview: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/03-mobile-restored-preview.png
- Persistence after reload: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/04-mobile-persisted-after-reload.png
- Two-step clear: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/05-mobile-clear-confirm.png
- Cleared state: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/06-mobile-cleared.png
- Desktop history: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/07-desktop-real-history.png
- Interaction metrics: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/after-metrics.json
- Accessibility metrics: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v36/accessibility-metrics.json

## Accessibility Limits

The run proves native keyboard activation for the history card, tested target sizes, visible focus styling from the existing system, responsive reflow, no horizontal overflow, and no console errors. It does not claim full WCAG conformance or prove every screen-reader announcement. Browser quota pressure was handled by the compact remote-image fallback in code but was not forced on a storage-constrained physical device.
