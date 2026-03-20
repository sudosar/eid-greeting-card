# Z-Index Stacking Analysis

## The Problem
The Interactive Sky Layer at z-14 has `pointerEvents: "auto"` and covers the ENTIRE viewport (1280x1100).
This layer sits BELOW the moon (z-16) and minarets (z-16), so in theory they should be clickable.

## Full Stack (top to bottom):
1. z-50: Audio player (fixed bottom-left) and Share button (fixed bottom-right) - pointer-events: auto
2. z-35: Vignette overlay - pointer-events: NONE ✓
3. z-30: Geometric corners, border lines, text container - pointer-events: NONE ✓
4. z-22: Arch frame - pointer-events: NONE ✓
5. z-20: Front lanterns (left/right) - pointer-events: auto, role: button ✓
6. z-16: **CRESCENT MOON** - pointer-events: auto, role: button, position: top=518, left=432, 320x450
7. z-16: **MINARETS CONTAINER** - pointer-events: auto, position: top=715, left=0, 1280x385
8. z-15: Mid lanterns - pointer-events: auto, role: button ✓
9. z-14: **INTERACTIVE SKY LAYER** - pointer-events: AUTO, covers 1280x1100 ← BLOCKS z-12 lanterns
10. z-12: Center lanterns - pointer-events: auto, role: button
11. z-10: Star/bokeh particles - pointer-events: NONE
12. z-8: Mosque silhouette - pointer-events: NONE

## Key Finding:
The moon is at z-16 and positioned at top=518, left=432, 320x450.
The minarets container is at z-16 and positioned at top=715, left=0, 1280x385.

Both are ABOVE the sky layer (z-14), so they SHOULD be clickable.

BUT WAIT - the moon is positioned at top=518 in a 1100px tall container. The viewport is only ~753px tall.
That means the moon is at 518px from the top, which is about 69% down the viewport.
The crescent in the BACKGROUND IMAGE is at about 37-50% from the top.

THE MOON INTERACTIVE ELEMENT IS NOT ALIGNED WITH THE VISIBLE CRESCENT MOON IN THE BACKGROUND!

The interactive moon hotspot is at y=518-968, but the visible crescent in the background image is at approximately y=280-650.

Similarly, the minarets container starts at y=715, but the visible minarets in the background are at roughly y=500-753.

## Root Cause:
The interactive elements are positioned based on percentages that don't match the actual background image positions. The container is 1100px tall (not 753px viewport), so the percentage-based positioning is off.

## Fix:
Need to reposition the interactive moon and minarets to match the actual visible crescent and minarets in the background image. Use viewport-relative units (vh) instead of percentage-based positioning within the container.
