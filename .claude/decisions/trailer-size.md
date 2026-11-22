# Trailer size

Sessions: 50b1d518-ae30-4002-83f8-8524302d8c79

## Decisions

- **In the movie and series cards, the trailer takes all the height the rest of the card leaves free, between
  200pt and 280pt.** The goal is the biggest trailer each phone can fit. The card keeps 8pt free at the top and
  bottom.
- **The zoom follows the trailer's size: height × 2.39 × 1.03 ÷ width.** Zooming until a 2.39:1 picture fills
  the box hides the black bars that many trailers have from YouTube. The extra 1.03 was picked by eye, so an
  iPhone 17 Pro at 240pt gets 1.6.
- **The details screen trailer keeps its fixed 224pt box (`h-56`), and the player fills it.**
