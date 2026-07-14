# Cardly v42 Design QA

- source visual truth path: C:/tmp/cardly-v42-mobile-audit/04-history.png
- implementation screenshot paths: C:/tmp/cardly-v42-history-qa/01-empty.png; C:/tmp/cardly-v42-history-qa/02-grouped.png; C:/tmp/cardly-v42-history-qa/03-filtered.png; C:/tmp/cardly-v42-history-qa/04-desktop-grouped.png
- viewport: 390x844 mobile and 1440x1000 desktop
- state: empty history, grouped history, Instagram-filtered history, restored card
- full-view comparison evidence: C:/Users/admin/Documents/Codex/2026-07-13/cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e-2/history-v42-before-after.jpg
- focused region evidence: C:/Users/admin/Documents/Codex/2026-07-13/cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e-2/history-v42-contact.jpg

## Findings

No actionable P0/P1/P2 issue remains in the revised history flow.

- Fonts and typography: month headings, platform chips, card titles, counts, and empty-state copy form a clear four-level hierarchy without cramped wrapping.
- Spacing and layout rhythm: mobile uses a one-column card stack and a sticky filter row; desktop uses three columns. Month groups have consistent dividers and 24–28px separation.
- Colors and visual tokens: filters use the existing ink/neutral tokens; saved-card thumbnails retain each card's content-derived palette.
- Image quality and asset fidelity: history thumbnails use the original saved imagery and platform icons; no placeholder or generated visual substitutes were added.
- Copy and content: the empty state explains persistence and offers one primary action; filtered-empty copy offers a direct route back to all works.
- Accessibility and behavior: filter buttons expose aria-pressed, mobile targets are at least 38px, the primary empty-state target is 44px, no horizontal overflow was measured, and restored cards open the Preview panel.

The focused comparison was required because the change concentrates hierarchy and controls inside the history region. The rest of the editor shell was intentionally unchanged.

## Comparison history

- Earlier P2: the mobile history panel was mostly blank and offered no recovery action, grouping, or browsing controls.
- Fix: added an explicit start CTA, platform filters, monthly grouping, count feedback, and direct restore-to-preview behavior.
- Post-fix evidence: two month groups and four platform filters rendered from seeded history; Instagram filtering returned exactly two cards; desktop and mobile overflow remained 0px; browser errors remained 0.

## Browser verification

- primary interactions: open empty History → start making → seed saved cards → filter by platform → restore card
- page identity and meaningful content: passed
- framework overlay: none
- console errors checked: 0
- Browser plugin availability: unavailable; regular Playwright used with prior user approval

final result: passed
