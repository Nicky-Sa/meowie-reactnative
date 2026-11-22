# Trailer size

Sessions: 50b1d518-ae30-4002-83f8-8524302d8c79

## Decisions

- **In the movie and series cards, the trailer takes all the height the rest of the card leaves free, up to
  280pt, and on screens under 830pt tall up to 230pt (`max-h-[230px] tall-sm:max-h-[280px]`). It has no
  smallest size.** The goal is the biggest trailer each phone can fit. Without a smallest size, the trailer
  shrinks before Save and Seen can slide under the tab bar.
- **Main screens leave the safe area plus 56pt at the top for the header.**
- **Screens inside the tabs leave 98pt at the bottom for the tab bar, and other screens leave only the safe
  area.** The tab bar takes 98pt on every phone, whatever the safe area. `useMainScreenContentStyle` finds the
  tab bar through `BottomTabBarHeightContext`, so no screen has to say whether it has one.
- **The gaps in the movie and series cards are 16pt, and on screens under 830pt tall 8pt
  (`gap-2 tall-sm:gap-4`).** At 16pt the card didn't fit on the iPhone SE or the mini.
- **Save/Seen sit straight in the card, so the card's gap is the space above them.** `Actions` has no margin
  of its own.
- **In the movie card, the poster row and the cast row sit in their own box inside `Tourable`, with the
  card's gap (`gap-2 tall-sm:gap-4`).** On the first card of a list the tour is on, and `AttachStep` puts its
  own `View` around what `Tourable` gets, so the rows can't use the card's gap there. A fragment instead of
  the box makes the two rows touch on the first card only. The series card has no tour step, so its rows sit
  straight in the card.
- **`Tourable` takes exactly one child.** `AttachStep` reads its child's props, so two children crash the app,
  and the type now catches that.
- **The card keeps 24pt free at the top and bottom, and on screens under 830pt tall 8pt
  (`py-2 tall-sm:py-6`).**
- **Screen size prefixes for phones check height (`tall-sm`, and later `tall-md`, `tall-lg`).** Phones differ
  far more in height than in width, and `sm:`/`md:` start at 640pt wide, which no iPhone reaches.
- **The zoom follows the trailer's size: height × 2.39 × 1.03 ÷ width.** Zooming until a 2.39:1 picture fills
  the box hides the black bars that many trailers have from YouTube. The extra 1.03 was picked by eye, so an
  iPhone 17 Pro at 240pt gets 1.6.
- **The details screen trailer keeps its fixed 224pt box (`h-56`), and the player fills it.**
- **On the details screen, the poster and title cover the bottom 48pt of the trailer (`-mt-12`), and the dark
  fade is 62pt tall.** This shows more of the trailer while the title stays easy to read.
