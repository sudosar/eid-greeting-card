# Layout Analysis from Browser Screenshot

## Current Desktop Layout (896x768 viewport)
- Arabic "عيد مبارك" is at roughly 30% from top, centered horizontally
- The crescent moon in the background image is positioned center-left, with its top curve at ~25% from top
- The Arabic text overlaps with the upper portion of the crescent moon - they are at similar vertical positions
- "EID MUBARAK" English text is below the Arabic, at ~45% from top
- Blessing text and Arabic blessing are at ~55-60%
- "EID AL-FITR 1447 AH" at ~65%
- Mosque silhouette at the very bottom ~80-100%
- Minarets are visible as dark silhouettes at the bottom edges

## The Overlap Issue
- The Arabic text "عيد مبارك" sits right where the crescent moon's upper curve is in the background
- This creates visual confusion - the golden text blends with the golden crescent
- Fix: Either move the text up slightly or add a subtle text shadow/backdrop to separate them

## Interactive Elements Needed
- Crescent moon: It's part of the background image (HERO_BG_URL), not a separate element
- Need to add a transparent clickable overlay positioned over the moon area
- Mosque minarets: Part of the MOSQUE_URL image
- Need clickable hotspot overlays positioned over the minaret locations
