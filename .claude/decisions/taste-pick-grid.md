# Taste onboarding: pick 5 titles from one mixed grid

Ticket: https://app.notion.com/p/41eb1b85bdfe811da910e2b5d4655581

Sessions: d1958063-9042-4a82-ba78-537f5c89fdcd

The backend's decisions for this ticket are in `meowie-backend/.claude/decisions/taste-pick-grid.md`.

## Decisions

- **The grid replaces the whole old journey.** `/taste` is the grid, and the movies, series and preferences steps,
  the poster deck and the `(journey)` route group are gone. The backend no longer sends what those steps read, so
  the grid and the removal went in together.
- **The result screen moved to `features/taste/result/`.** With the steps gone, a `steps` folder holding one screen
  made no sense.
- **`tasteAtom` stores `picks`, saved under a new key, `taste-picks`.** A guest who finished the old flow but never
  signed in would otherwise send old ratings after sign-in, which the backend rejects. With the new key they see
  the grid again.
- **`taste_skipped` sends `movie_pick_count` and `series_pick_count`.** It used to send `movie_answer_count`. Two
  counts show which type people pick before they skip.
- **The grid is built from the shared pieces.** `InnerScreen` gives the "Your taste" title and Skip and hides the
  back arrow when there is nothing to go back to, which covers both the first launch and the in-app version.
- **One poster grid, `PostersGrid`, serves both the taste grid and `PostersList`.** It holds the columns,
  spacing, skeletons and error state, and each caller says how to draw a poster. `PostersList` is
  `PostersGrid` with paging and `ExpandablePoster`, and the taste grid is `PostersGrid` with `SelectablePoster`.
- **`PostersGrid` has one type cast, allowed on purpose.** `Animated.createAnimatedComponent(FlashList)` loses the
  item type, and the plain `FlashList` calls `onScroll` as a plain function, which breaks the Reanimated scroll
  handlers that the person, explore, saved and seen headers use. Everything is typed for the item before the one
  hand-over to the animated list.
- **The taste grid uses the posters' spacing, 8pt at the edges and between rows.** Figma has 16pt edges and 12pt
  rows, but matching it would need a spacing prop on the shared grid.
- **A tap selects a poster through `SelectablePoster`, next to `ExpandablePoster` in `features/common/posters/`.**
  `ExpandablePoster` opens a title, and `SelectablePoster` selects it.
- **Posters and skeletons in the grid fill their cell, with no width worked out in code.** FlashList splits the
  list's width by the columns, so the spacing lives only in the `px-1` and `h-2` classes and changes in one place.
- **`PosterCard` is now `PlainPoster`, and `Poster` is now `ExpandablePoster`.** With three poster components side
  by side, each name now says what a tap does.
- **The selected frame is `PlainPoster`'s `selected` prop, a 4pt `brand-1` layer drawn on top.** The card's own 1pt
  `neutral-2` border never changes, so the poster doesn't move when it's selected. A thicker border on the card
  itself shrank the poster by 3pt and made it wobble. The layer sits inside the card's border, so its radius is
  the card's radius minus the border; with the full radius, the poster showed at the corners. Figma's cards are
  scaled down, so its 0.88pt and 3.5pt are the 1pt and 4pt of the full-size card.
- **`PlainPoster` has one second line, `subtitle`, in `neutral-6` as Figma has it.** It used to have a `badge` too,
  which showed the genre on the "More like this" posters. Each poster showed only one of the two, and they looked
  almost the same, so the genre is now the subtitle and keeps its `neutral-6`.
- **A failed load shows the shared error text.** `ErrorState` gets the error itself, so the backend's message or
  "We couldn't reach Meowie…" shows, like other screens.
- **A disabled `Button` uses each colour token's own `disable` value, as Figma shows.** Every variant keeps whole
  tokens and picks `default` or `disable`, so ghost and link buttons stay without a box. The old 50% fade is gone,
  because grey at half strength would almost disappear.
- **The building screen shows for at least 5 seconds, not the 2 that Figma and the ticket first had.** The feed is
  built while it shows, so 5 seconds gives the first feed time to be ready. The ticket now says 5.
- **The building screen shows 3 random picks in Figma's fan.** Picks only hold an id and a type, so the posters come
  from the journey the grid already loaded.
- **The 3 posters start stacked, with the middle one at 1.5×, and fan out after it shrinks.** After a 0.5 second
  wait, so the screen has finished appearing, the middle poster shrinks to its size over 0.7 seconds. Then the side
  ones slide out and tilt to Figma's ±10° over 0.6 seconds. The moves and tilts are numbers in the animation,
  measured from the middle poster, because a class can't animate.
- **The building screen is built from plain `View` and `Text`, like `ShareTasteCard`, not on `InformationBlock`.**
  It needs a title, the picked posters and Figma's 16pt gaps, which `InformationBlock` doesn't have.
