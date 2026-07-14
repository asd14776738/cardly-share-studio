# Cardly v34 Design QA

**Source visual truth path**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/desktop-before-after.jpg
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/mobile-before-after.jpg
- Reference direction: official 小作卡片 listing and Poet.so product page

**Implementation screenshot path**

- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/desktop-content.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/desktop-styled.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/mobile-content.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/mobile-preview.png
- C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/mobile-style.png

**Viewport and state**

- Desktop: 1600 × 1000, default content and styled 4:5 states
- Mobile: 390 × 844, Content / Preview / Style states

**Full-view comparison evidence**

- Desktop before/after comparison confirms a more stable stage, stronger link-first hierarchy, narrower side panels, and quieter controls.
- Mobile before/after comparison confirms the editor is above the fold and the preview no longer blocks task entry.

**Focused region comparison evidence**

- Mobile workspace switcher, URL block, preview toolbar, theme controls, and desktop panel headings were inspected at native screenshot resolution.
- The first pass exposed a content-heading collision on desktop and retained scroll offset when switching mobile modes.

**Findings**

- [P3] Some secondary utility targets remain below 40 px.
  Location: preview zoom controls and a few tertiary style utilities.
  Evidence: desktop metrics report 14 visible targets under 40 px; mobile Style reports 8.
  Impact: low-frequency controls are slightly less forgiving than the new primary controls.
  Follow-up: raise zoom and tertiary utility hit areas to 40–44 px without increasing visible chrome.

**Required Fidelity Surfaces**

- Fonts and typography: passed. UI hierarchy is clearer; card title/body weights are now visibly distinct and Chinese fallback stacks remain intact.
- Spacing and layout rhythm: passed. Desktop columns and mobile task modes align consistently; first-pass heading collision was fixed.
- Colors and visual tokens: passed. Warm neutrals and ink active states replace the previous bright-blue-heavy chrome while preserving content themes.
- Image quality and asset fidelity: passed for the default state. Original platform assets and extracted imagery remain source-backed; no new placeholder asset was introduced.
- Copy and content: passed. Existing Chinese labels and platform names remain accurate; Content tuning and 18+ platform disclosure improve scanability.

**Primary interactions tested**

- Mobile Content / Preview / Style switching
- Source tab selection
- Theme selection
- 4:5 ratio selection
- Preview state update
- Static build and all adapter/layout/palette/link/hashtag/icon tests

**Console errors checked**

- Final capture: none.

**Comparison history**

1. First pass: P1 desktop heading/subcopy collision; P2 mobile Style mode opened with retained scroll offset.
2. Fixes: restored a 48 px heading block and reset mobile mode switching to document top with non-animated scrolling.
3. Post-fix evidence: desktop heading is separated correctly; all mobile modes begin at y=110 under the sticky workspace tabs; final console error list is empty.

**Implementation Checklist**

- [x] Link-first desktop hierarchy
- [x] Stable three-column creator shell
- [x] Mobile workspace modes
- [x] Automatic mobile Preview handoff after extraction
- [x] Collapsible content/platform sections
- [x] Warm-neutral premium token pass
- [x] Post-fix visual recapture
- [x] Automated test suite

**Follow-up Polish**

- Increase tertiary utility hit areas without adding visual weight.
- Consider a dedicated mobile recent-history mode instead of rendering history below the active workspace.

final result: passed
