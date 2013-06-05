# target#

target is a simple line-based web game programmed in JavaScript & HTML5.

## How to play ##

The objective of the game is to avoid lines from hitting the *target*. Incoming lines, *threats*, come from around the screen & extend towards the target at a rate relative to the level. The player can destroy these lines by drawing their own lines - clicking, dragging & releasing with the mouse.

## Technical overview ##

Levels are standard in terms of game logic - points needed to progress to the next level .etc - but the colours of the levels are retrieved from [colorlovers](colorlovers.com), a colour palette website, using AJAX. Levels are moderated to make sure they are possible (the colours are perceivably different) by converting them into HSLA & using euclidean distance as a metric.


A live demo can be found on [my university filespace](http://users.aber.ac.uk/gij2/iwp). Please note that this is by no means a recent version, but it demonstrates how the game plays out.

Suggestions of further features can be found in the last section of writeup.pdf.
