# Current State Findings

## Screenshot Analysis
- The Arabic text "عيد مبارك" is positioned near the top-center, overlapping with the crescent moon area
- The crescent moon is a large element in the center-left of the scene (part of the background image)
- The English text "Eid Mubarak" and other greeting text is NOT visible - it appears to be pushed below the visible viewport or hidden behind the crescent moon
- The mosque silhouette is visible at the bottom with minarets
- Lanterns are visible at top-left and top-right
- Audio player is at bottom-left, share button at bottom-right

## Key Issues
1. OG image URL is relative (/api/og-image) - needs absolute URL with host
2. The greeting text container is centered but the crescent moon in the background image takes up a lot of visual space
3. The Arabic text overlaps with the moon visually
4. The English text and blessing text are not visible in the screenshot - likely below the fold or behind elements
5. Mosque minarets are part of a single raster image - need overlay hotspots for interactivity
6. Crescent moon is part of the background image - need a separate interactive element

## Fix Plan
1. Fix OG tags: Make injectDynamicOgTags use req.protocol + req.get('host') for absolute URLs
2. Fix text positioning: Move greeting text higher or adjust layout so it doesn't overlap the moon
3. Add interactive crescent moon as a separate SVG overlay element
4. Add interactive minaret hotspots over the mosque silhouette image
