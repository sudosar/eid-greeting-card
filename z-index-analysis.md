# Z-Index Stacking Analysis

| Layer | Element | Z-Index | Pointer Events |
|-------|---------|---------|----------------|
| Background | Hero BG | 0 | none |
| Overlay | Contrast overlay | 1 | none |
| Stars | TwinklingStars | 2 | none |
| Mosque | MosqueSilhouette | 8 | none |
| Bokeh | BokehParticles | 10 | none |
| Float | FloatingLightParticles | 11 | none |
| Center lanterns | center-left, center-right | 12 | auto |
| Sky | InteractiveSkyLayer | 14 | auto (captures clicks) |
| Mid lanterns | left-mid, right-mid | 15 | auto |
| Moon | InteractiveMoon | 16 | auto |
| Minarets | InteractiveMinarets | 16 | auto |
| Front lanterns | left-front, right-front | 20 | auto |
| Arch | ArchFrame | 22 | none |
| Text | GreetingText | 30 | none (pointer-events-none on parent) |
| Vignette | Vignette overlay | 35 | none |
| Audio/Share | UI controls | 40 | auto |
| Fireworks | Fireworks overlay | 60 | none |

## Issues
- Moon and minarets at z-16 are now above the sky layer (z-14) - clicks should work
- The GreetingText parent has pointer-events-none, so text won't block clicks
- The vignette is pointer-events-none, so it won't block clicks

## Mobile Concerns
- h-screen is used for the main container - this should work on mobile
- overflow-hidden prevents scrolling - this is intentional for a greeting card
- The greeting text uses responsive sizes (text-4xl sm:text-5xl md:text-7xl lg:text-8xl)
- The mosque silhouette uses max-h-[25vh] on mobile
- Some lanterns are hidden on mobile (hidden sm:block)
- On very small screens (320px), the text might be cramped
