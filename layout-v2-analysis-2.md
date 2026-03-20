# Layout V2 Analysis - After Browser Test

## Current state (883x753 viewport):
1. TOP ZONE: Small decorative star visible at very top (no name param) - OK
2. CRESCENT ZONE: Arabic "عيد مبارك" is at ~28vh — it's positioned at the TOP of the crescent moon, right where the arch frame peaks. The text sits nicely within the arch but is slightly above the crescent's inner curve.
3. BOTTOM ZONE: "EID MUBARAK" + blessing text is at ~62vh — visible and below the crescent! The Arabic prayer and year label are also visible.

## What's working well:
- The three-zone split is working! Arabic text is separate from the English text.
- "EID MUBARAK" is clearly below the crescent moon body.
- The blessing text is readable.
- The Arabic prayer "تقبّل الله منّا ومنكم" is visible.
- "EID AL-FITR 1447 AH" is visible at the bottom.

## Issues:
1. The Arabic "عيد مبارك" at 28vh is sitting ON the crescent's upper edge, not inside the inner curve. Need to move it down to ~33-35vh to sit in the empty space inside the crescent curve.
2. The bottom zone text is slightly cut off at the bottom — the "EID AL-FITR 1447 AH" is barely visible.
3. The Arabic text needs more glow/contrast to stand out against the dark arch area.

## Adjustments:
- Move Arabic text from 28vh to 20vh (above the crescent entirely, in the dark sky area between lanterns and crescent)
- OR move to 35vh to sit inside the crescent curve
- Move bottom zone from 62vh to 58vh to give more room at the bottom
