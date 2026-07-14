# Cardly v41 Design QA

- source visual truth path: C:/Users/admin/AppData/Local/Temp/codex-clipboard-c4a71f4d-5392-4325-ae09-1abf87e261b9.png
- reported failure path: C:/Users/admin/AppData/Local/Temp/codex-clipboard-02269180-9b97-4a44-8132-4b46291ea999.png
- implementation screenshots: C:/tmp/cardly-ratio-v41-after/before-square.png; C:/tmp/cardly-ratio-v41-after/before-portrait.png; C:/tmp/cardly-ratio-v41-after/before-wide.png
- full-view comparison evidence: C:/Users/admin/Documents/Codex/2026-07-13/cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e-2/ratio-comparison.jpg
- viewport: 1440x1000 desktop and 390x844 mobile
- state: one portrait image, fixed 1:1 / 4:5 / 16:9 canvas ratios

## Findings

No actionable P0/P1/P2 issue remains in the fixed-ratio flow.

- Fonts and typography: fixed canvases now use ratio-specific title and body clamps; hierarchy remains intact without pushing the gallery out of view.
- Spacing and layout rhythm: square and portrait canvases use explicit header/copy/media/footer grid rows. The square media region increased from 0px to 225px; portrait from 93px to 289px; wide from 105px to 127px.
- Colors and visual tokens: the existing content-derived palette, surface opacity, border, and shadow system is unchanged.
- Image quality and asset fidelity: single images use full-bleed cover treatment in every fixed ratio rather than contain/letterbox. Source imagery remains unchanged; only crop behavior is ratio-specific.
- Copy and content: no app copy changed. Long text receives deterministic clamping only in fixed-size canvases.
- Responsiveness and accessibility: all three ratios have zero horizontal overflow at 390px; controls remain in the existing mobile Style → Preview path.

The focused comparison was required and performed on the card region because the defect was specifically the media allocation and crop inside fixed canvases. The broader studio shell was intentionally unchanged.

## Comparison history

- Earlier P1: 1:1 could collapse the media gallery to 0px and all fixed ratios used contain, producing gray letterboxing and thumbnail-like imagery.
- Fix: added ratio-specific content plans, bounded copy, explicit grid rows, minimum media regions, and cover cropping.
- Post-fix evidence: square 225px, portrait 289px, and wide 127px media regions; all three report object-fit cover, no console errors, and no mobile overflow.

## Browser verification

- primary interactions: upload one portrait image → select 1:1 / 4:5 / 16:9 → open preview → export PNG
- export dimensions: 1080x1080, 1080x1350, 1600x900
- console errors checked: 0
- Browser plugin availability: unavailable; regular Playwright used with prior user approval

final result: passed
