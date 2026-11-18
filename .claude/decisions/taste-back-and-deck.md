# Back from the taste movies step goes to onboarding and restarts the deck

## Decisions

- **"Let's Go" on onboarding opens taste with `router.replace`.** Back from the movies step then can't return to onboarding, and Skip or the result screen leave Home with nothing under it, so back does nothing on Home.
- **`InnerScreen` shows its back arrow only when there is a screen to go back to.** After the change above, the movies step opened from onboarding has nothing under it. Hiding the arrow was picked over making it act like Skip. Taste opened from the share card still has its arrow. It uses `useCanGoBack`, like the error boundary.
- **Without the arrow, the header gets a 16pt left padding.** The title then lines up with the content below it. An empty box the arrow's size was tried, which kept the title still between steps, but it wrote the button's size a second time and left a blank gap.
- **The deck opens on the card after the furthest answered one.** The answers stay in `tasteAtom`, so a user who leaves and comes back picks up where they stopped instead of going through every card again. Opening on the first title without an answer would send a user who skipped cards back to the first skipped one. If the last card has an answer, the deck opens on it. This covers the movies and series steps, since both use `RatingStep`.
- **The start comes from the answers, not from a saved card.** Saving the shown title would land exactly where the user stopped, but it adds a saved field and two props to `RatingStep`. Landing just past the furthest answer was close enough.
- **The app keeps no seed or saved order for the deck.** The backend sends every user the same fixed order, so the answers point to the same places after the app restarts or drops its copy.
