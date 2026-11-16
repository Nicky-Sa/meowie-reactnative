# Scroll peek hint

## Decisions

- **The hint scrolls the real feed with Reanimated's `scrollTo`, instead of moving the list with a transform.** The
  cards fade by scroll position, so only a real scroll shows the next movie the way a swipe does. To make this work,
  `useListRef` now gives an animated ref, and every list that uses it gets one.
- **The Swipe guide ("Swipe to navigate" with its Lottie) is gone, with its atom and storage key.** The peek
  teaches scrolling without words, and the guide's dark fade covered the bottom third, where the next movie peeks in.
- **The hint plays when the tour is done and `scrollHintSeen` is false.** `scrollHintSeen` turns true when the peek
  starts, so an interrupted peek still counts as played. It also turns true on the first scroll to another card, which
  covers "never again after the first real scroll".
- **Users who scrolled before this release see the peek once.** Their first scroll was saved only under the Swipe
  guide's key, and that key is gone.
- **A touch during the 0.8s wait cancels the hint for this visit only.** The peek never played, so it can play on the
  next visit.
- **A touch during the peek or settle stops it and scrolls the feed back to the first card with a native animated
  scroll.** With paging on, a stopped feed would stay halfway after a tap. A drag takes over the native scroll, and
  paging snaps it.
- **The touch catcher is a `View` around the feed in `TabContent`, not the whole Home screen.** The hint lives with
  the list. Tapping the Movie/Series toggle unmounts the tab, which ends the hint anyway.
- **Every animation step sets `ReduceMotion.Never`.** Reanimated skips animations under Reduce Motion by default, and
  the ticket says these users need the hint too.
- **The settle spring uses a perceptual duration of 400ms with damping ratio 0.5.** Reanimated runs a spring about
  1.5 times its perceptual duration, so it takes about 0.6s, and the ratio gives a visible bounce. The Figma
  prototype has no motion data to copy.
- **The feed list sets `scrollToOverflowEnabled`.** iOS clamps code-driven scrolls to the content, so without it the
  spring's dip past the top was cut off and the bounce didn't show.
- **Deleting the account resets `scrollHintSeen`, like the tour.**

## PostHog events

- **`feed_first_scrolled` counts its seconds from the moment the tour ends, not from when Home opens, so its property
  is `seconds_since_tour_ended`.** The peek
  starts 0.8s after the tour ends, and tour reading time varies a lot without the peek changing it. Old versions send
  `tour_completed` or `tour_skipped`, so a funnel to the first `media_scrolled` (`media_swiped` before its rename)
  gives the same number from before.
- **The tour end time is kept in memory only, and the seconds are sent empty when the first scroll happens in a later
  launch.** Most new users scroll in the launch where they saw the tour, and saving the time would add another
  stored value. The tour's `onStop` in `app/_layout.tsx` sets it, because that runs for both finish and skip.
- **`feed_first_scrolled` has its own saved flag, `feedFirstScrollTracked`.** `scrollHintSeen` can't show it was sent,
  because it also turns true when the peek plays. Deleting the account resets the flag, like the tour.
- **`hint_shown` is `scrollHintSeen` read just before the first scroll saves it as seen.**
