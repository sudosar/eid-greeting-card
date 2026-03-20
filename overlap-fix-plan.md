# Overlap Fix Plan

## Current Layout (883x753 viewport)
- Arabic "عيد مبارك" text: positioned at roughly y=220 to y=290 (top of text block)
- "EID MUBARAK" English: y=320 to y=370
- Blessing text: y=400 to y=440
- Arabic blessing: y=455 to y=475
- "Eid al-Fitr 1447 AH": y=510

## Crescent Moon in Background Image
The crescent moon is part of the hero background image. Its top horn starts at approximately:
- Top of crescent: ~y=370 (about 49% from top)
- The crescent curves from center-left down to bottom-right
- The moon body is at roughly y=370 to y=680

## The Overlap
The "EID MUBARAK" English text (y=320-370) sits right at the top of the crescent.
The blessing text (y=400-440) overlaps directly with the crescent body.
The Arabic blessing (y=455-475) is inside the crescent.

## Fix Strategy
The text container currently uses `items-center justify-center` (vertically centered) with `marginTop: -8vh`.
The -8vh only moves it up ~60px which is not enough.

**Solution**: Change the parent flex container from `items-center justify-center` to `items-start justify-start` with padding-top, OR use a much larger negative margin like -20vh to -25vh to push the text block well above the crescent.

Better approach: Use `items-start` with `pt-[12vh]` to position text in the upper third of the screen, clearly above the crescent moon.
