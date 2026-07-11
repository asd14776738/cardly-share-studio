# Cardly Regression Design QA

- User-reported broken screenshot: C:\Users\admin\AppData\Local\Temp\codex-clipboard-c3ae2ce7-7965-4183-85a2-208f27c6afff.png
- Fixed desktop preview: C:\Users\admin\Documents\Codex\2026-07-11\cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e\work\qa\user-content-final.png
- Fixed mobile preview: C:\Users\admin\Documents\Codex\2026-07-11\cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e\work\qa\user-content-fixed-mobile.png
- Fixed PNG export: C:\Users\admin\Documents\Codex\2026-07-11\cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e\work\qa\user-content-final-export.png
- Combined comparison: C:\Users\admin\Documents\Codex\2026-07-11\cardly-sites-project-appgprj-6a51f0bacb208191b5e12b3987c0bf6e\work\qa\user-regression-final.jpg
- State: X source, no image, title “来 (@ooobsess) on X”, exact body copy from the user screenshot
- Viewports: 1440 × 1000 desktop and 390 × 844 mobile

## Root cause

Production served version 7 HTML while the browser reused an older one-hour-cached stylesheet and script. The incompatible resource mix removed the inset card surface, applied the former oversized title rules, left the new QR image at intrinsic size, and retained a forced minimum card height.

## Fixes

- Added explicit version query strings to CSS and JavaScript.
- Changed all site assets to no-cache/no-store/must-revalidate.
- Removed the 620 px minimum height for automatic text-only cards.
- Clear preset images before extracting a real link so image-less posts do not show unrelated stock imagery.
- Use the real link hostname for every source label, producing X.COM for the reported case.
- Kept publisher identity at 13 px while short main content renders at 24 px desktop / 21 px mobile.
- Reduced preview QR to 42 px and added the same real QR to PNG export.
- Reduced image-less auto export minimum height from 1180 to 820 px.

## Evidence

- Broken production screenshot: 609 × 619 with oversized publisher title, tiny body, 128 px QR, missing inset surface, and large empty region.
- Fixed preview: 500 × 416, 13 px publisher, 24 px body, 42 px QR, no images, no horizontal overflow.
- Fixed mobile preview: 326 × 402, 13 px publisher, 21 px body, 42 px QR, no horizontal overflow.
- Fixed PNG: 1080 × 820, 515275 bytes, compact content-driven height and QR at bottom right.
- Local API 404 messages are expected from the static Python preview server; production API verification is required after deployment.

## Required fidelity surfaces

- Typography: publisher and main body hierarchy restored and verified using the user's exact text.
- Spacing: inset surface, compact content height, footer spacing, and outer gradient frame restored.
- Colors: original Cardly mist gradient and translucent white surface retained.
- Images: no unrelated fallback image appears when extraction returns no image.
- Copy: X.COM comes from the actual link; placeholder @DESIGNNOTES is removed.
- Responsiveness: desktop and mobile have no horizontal overflow.
- Export: preview and PNG share the same compact hierarchy and QR placement.

## Comparison history

1. User reported version 7 as worse than the original.
2. Screenshot audit isolated mixed cached assets as the primary regression.
3. Cache busting and content-empty rules fixed the visual hierarchy and blank space.
4. A same-content before/after/export comparison found the placeholder source label; it was replaced with X.COM.
5. Final local comparison has no remaining P0/P1/P2 visual regression.

final result: passed
