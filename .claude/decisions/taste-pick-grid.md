# Taste onboarding: pick 5 titles from one mixed grid

Ticket: https://app.notion.com/p/41eb1b85bdfe811da910e2b5d4655581

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
  back arrow when there is nothing to go back to, which covers both the first launch and the in-app version. Each
  poster is a `PosterCard` inside a `PickCard` that adds the tap and the frame.
- **The frame is 1pt `neutral-2`, and 4pt `brand-1` when picked.** That is Figma's movie card at its full size.
  The design's cards are scaled down, so their 0.88pt and 3.5pt are not the real values.
- **The year line keeps `PosterCard`'s `neutral-5`.** Figma uses `neutral-6`, and the difference was judged too
  small for a new variant.
- **A failed load shows the shared error text.** `ErrorState` gets the error itself, so the backend's message or
  "We couldn't reach Meowie…" shows, like other screens.
