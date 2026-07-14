# Cardly v40 Product Flow Audit

## Outcome

The two highest-impact creation paths now fail safely and communicate progress without adding persistent interface noise.

1. Paste/source recognition — Healthy. Known platforms are identified immediately and the hint exposes Ctrl/Cmd+Enter.
2. Generate/extract — Healthy. Duplicate requests are blocked; failed extraction preserves the active card and exposes retry, manual edit, and image upload.
3. Export — Healthy. Visible content images must finish loading before rasterization; broken or pending images receive a specific recovery message. Both export controls show one synchronized busy state and restore reliably.
4. Responsive editing — Healthy. Desktop composition remains stable and the 390 px viewport has no horizontal overflow.

## Evidence

- All adapter and utility suites passed, including source-input, extraction feedback, and export readiness.
- Browser regression passed with no page or console errors.
- Design QA: passed with no actionable P0/P1/P2 findings.
