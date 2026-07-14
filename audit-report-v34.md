# Cardly v34 Product Design Audit

## Outcome

The v34 pass converts Cardly from a long stacked editor into a focused creator workspace. Desktop keeps the three-column model but gives the preview a stable stage and independently scrolling controls. Mobile now starts on the task the user came to do and exposes Content / Preview / Style as three persistent workspace modes.

## Audit Steps

1. **Desktop baseline capture — healthy.** Captured v33 at 1600 × 1000 and measured the three columns, preview card, scroll height, and interactive target sizes.
2. **Mobile baseline capture — issue found.** Captured v33 at 390 × 844. The page opened with the full preview first; the editor began at y=1109 and the document was 3489 px tall.
3. **Competitive grounding — healthy.** Used the official 小作卡片 App Store listing and Poet.so product page to establish a target of link-first flow, restrained visual chrome, flexible export, and content-led hierarchy.
4. **Desktop hierarchy review — issue fixed.** Rebalanced the shell to 360 / flexible preview / 340 px, capped it at 1520 px, introduced 40 px outer breathing room at 1600 px, and removed the duplicated style-panel export action.
5. **Task-entry review — issue fixed.** Made the URL field and Generate action the first strong block, moved platform shortcuts below it, grouped manual fields under Content tuning, and collapsed the 18+ platform rail.
6. **Mobile journey review — issue fixed.** Added the sticky Content / Preview / Style switcher, made Content the default, and automatically moves successful extraction to Preview.
7. **Control and token review — improved.** Replaced bright-blue-heavy states with an ink-and-warm-neutral system, increased primary control heights to 40–46 px, and strengthened typography hierarchy.
8. **Post-build visual QA — passed.** Re-captured desktop and all three mobile modes. Fixed the first-pass desktop heading collision and mobile retained-scroll offset, then re-captured with zero console errors.

## Measured Change

- Mobile editor entry: y=1109 → y=110, about 90% closer to the top.
- Mobile document height: 3489 px → 1768 px, about 49% shorter.
- Mobile visible targets under 40 px: 20 → 2 in the Content mode.
- Desktop visible targets under 40 px: 22 → 14; remaining small targets are secondary zoom/card utilities and are tracked as P3 polish.
- Desktop preview workspace: 735 px → 818 px at 1600 px, while side panels stay intentionally compact.

## Evidence

- Desktop comparison: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/desktop-before-after.jpg
- Mobile comparison: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/mobile-before-after.jpg
- Mobile v34 modes: C:/Users/admin/.codex/visualizations/2026/07/13/019f59be-0db9-7dd2-b2bc-c7b7091d8705/cardly-v34/mobile-v34-states.jpg
