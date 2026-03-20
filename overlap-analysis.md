# Overlap Analysis - Screenshot 2026-03-20

Looking at the screenshot, the Arabic text "عيد مبارك" is positioned at roughly y=220-290 (top portion of viewport).
The crescent moon's top horn starts at roughly y=280 and curves down to y=650.

The overlap area: The Arabic text bottom edge (~y=290) meets the crescent moon's upper tip (~y=280).
The "EID MUBARAK" English text is at ~y=330-360, which sits right on the crescent's upper curve.

The crescent moon is part of the BACKGROUND IMAGE (eid-hero-bg), not a separate element.
The text is in a centered flex container with marginTop: '-8vh'.

The issue: -8vh only moves the text up by about 60px on a 753px viewport. The text block as a whole still overlaps with the crescent moon in the background image.

SOLUTION: Need to move the entire text block significantly higher, or reposition the text to sit clearly ABOVE the crescent moon's top edge. The crescent top is at roughly 37% from top of viewport. Text should end before 35%.
