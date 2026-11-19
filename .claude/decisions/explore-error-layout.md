# Error and empty state layout

## Decisions

- **`InformationBlock` has no background of its own.** With its own solid background, every screen that drew the
  gradient showed a box or a line wherever the block didn't reach the screen edges, like on Explore, the Home feed and
  inside a feed item. Only the offline and "Please update" covers sit on top of the running app, so only their wrappers
  paint `bg-neutral-15-default`. The error boundary paints it too when there is no back arrow, because then it replaces
  the whole app and nothing is drawn behind it.
- **Every error, empty state and picture-with-message screen uses `InformationBlock`.** That covers `ErrorState`,
  `EmptyState`, the guest Saved and Seen lists and the not-found screen.
- **There is one `EmptyState`, which takes an optional `img` and `text`, like `ErrorState` takes its error.** Filters,
  search and person pass their own text, and search its own picture, straight to `EmptyState`. `SavedEmptyState` and
  `SeenEmptyState` stay as small components that return `EmptyState`, because each is used in two places and their text
  should be written once.
- **The taste loading screen uses `InformationBlock` too, with its progress bar as the child.** It takes the block's
  spacing and text colour, so it matches the other picture-with-message screens.
- **Queries don't retry a 4xx answer from the backend, except 429.** The backend gave that answer on purpose, so three
  retries only made a 404 take about 10 seconds to show. A 429 comes from the rate limit, which lets a later try through.
- **`EmptyState` shows `errors/no-match.svg`.** Before, it showed only the text "No data to show.".
- **Explore's error and empty state use the same wrapper, with no side or top padding.** One pattern for both, so they
  sit at the same height.
- **The Home feed shows its error in place of the list when nothing has loaded yet.** Inside the list, the error sat in a
  block one feed item tall and was centred lower than on Explore.
- **The e2e test for error screens opens a movie, a series and a person that don't exist.** The preview backend can't
  be made to fail during a test, but it answers an unknown id with its own error message, so the test sees a real
  `ErrorState` with the backend's text.
