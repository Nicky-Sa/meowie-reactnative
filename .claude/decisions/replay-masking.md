# Replay masking

## Decisions

- **`maskAllTextInputs` and `maskAllImages` are off.** On iOS, PostHog treats every React Native `Text` as a text
  input, and every image and SVG as an image, so these flags covered the whole screen in black blocks.
- **Every text input is hidden in recordings, through `PostHogMaskView` in the shared `TextInput`.** The ticket keeps
  all inputs hidden, search and feedback included, so the `maskInReplay` prop is gone.
- **`PostHogMaskView` wraps the whole input box, not only the `RNTextInput`.** The box already fills the column's
  width, so the wrapper needs no layout class of its own.
- **The `ph-no-capture` prop is not used for replay.** PostHog's iOS replay only looks for `ph-no-capture` in
  `accessibilityLabel` or `accessibilityIdentifier`; the prop only stops touch autocapture.
- **The user's email is hidden on the OTP code screen and the delete-account screen.** These are the only screens
  that show personal data as plain text. On the delete-account screen the whole sentence is hidden, because the email
  is a nested `Text` inside it and a nested `Text` can't be wrapped on its own.
