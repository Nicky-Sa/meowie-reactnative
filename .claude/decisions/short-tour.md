# Short tour

## Decisions

- **Step 2 has one highlight around the poster, the description, the genres and the cast row.** Figma shows a box around only the genres and the cast row, but in the app the genres sit beside the poster and the cast row is a separate row, and the tour library highlights one element per step.
- **A tap on the dark area outside the tooltip does nothing during the tour.** The tour only moves with the tooltip's own buttons, so every move is one of the tracked events.
- **The tour starts only while Home is in focus.** If the first movie loads while the user is on another tab, the tour waits until they come back to Home, so it never opens on top of another screen.
