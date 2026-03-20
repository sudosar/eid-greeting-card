# Text Layout Analysis (1280x1100 viewport)

The text container spans from y=231 to y=782 (551px total), fitting well within the 1100px viewport.

| Element | Top | Bottom | Height | Content |
|---------|-----|--------|--------|---------|
| Top divider | 263 | 264 | 1 | decorative line |
| Arabic h1 | 288 | 444 | 156 | عيد مبارك |
| Star | 460 | 484 | 24 | decorative star |
| English h2 | 500 | 548 | 48 | Eid Mubarak |
| Blessing p | 572 | 637 | 65 | May this blessed... |
| Arabic blessing | 653 | 689 | 36 | تقبّل الله منّا ومنكم |
| Bottom divider | 713 | 714 | 1 | decorative line |
| Year label | 730 | 750 | 20 | Eid al-Fitr 1447 AH |

At 1100px viewport height, everything fits. On a 667px mobile viewport (iPhone SE), the content would need to be more compact. The Arabic h1 at 156px height is the largest element. On mobile (text-4xl = 36px), this would be smaller.

The layout should adapt well to mobile since all text uses responsive Tailwind classes (text-4xl sm:text-5xl md:text-7xl lg:text-8xl).

## Mobile Viewport Considerations
- No scrolling is needed (overflow-hidden is correct for a greeting card)
- The card should fit in a single viewport on all devices
- The -8vh margin on the text container helps push it above the crescent moon
