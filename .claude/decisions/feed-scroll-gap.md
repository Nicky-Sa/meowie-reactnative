# Feed scroll gap

## Decisions

- **Each feed item is as tall as the space between the header and the navbar, not a full screen.** With
  full-screen items, a swipe showed about 300pt of empty space before the next movie, so people might not see
  that they can scroll. Now the gap is about 60pt.
- **The list itself is one item tall and uses `pagingEnabled`, instead of a full-screen list with
  `snapToInterval`.** Snapping stopped about 0.8s after the finger lifted, against about 0.35s for paging, and
  the trailer only switches when the scroll stops. The list draws outside its own edges (`overflow: "visible"`
  on both `style` and `overrideProps`, as FlashList's docs show), so the next movie still shows behind the
  navbar while swiping.
- **Neighbour items fade to 0.0005, not 0.** At 0 the trailers lose their sound. At 0.0005 the sound works and
  the previous movie behind the header can't be seen.
- **This applies to every `MediaList`:** the home feed and the full-screen list opened from Discover and
  Explore posters.
