# Overlap Fix Analysis - After First Attempt

The text has moved up significantly. The Arabic "عيد مبارك" is now at roughly y=160-220.
"EID MUBARAK" is at roughly y=240-280.
Blessing text is at y=290-310.
Arabic blessing is at y=330-350.
"Eid al-Fitr 1447 AH" is at y=370-380.

The crescent moon top horn starts at roughly y=280.

RESULT: The Arabic title "عيد مبارك" is now clearly above the crescent. 
However, "EID MUBARAK" at y=240-280 still slightly touches the top of the crescent at y=280.
The blessing text and Arabic blessing still overlap with the crescent body.

The text block ends at y=380, but the crescent starts at y=280. So there's still about 100px of overlap.

NEXT: Need to either:
1. Move text even higher (reduce pt from 8vh to 4vh)
2. OR accept that some text sits on the crescent (which can look intentional/artistic)
3. OR add a dark semi-transparent backdrop behind the text to make it readable over the crescent

Option 3 is best - add a subtle dark gradient backdrop behind the text so it reads well even over the crescent. This is a common design pattern for text over images.
