# Review prompt

## Decisions

- **Meowie asks for an App Store rating with Apple's own popup, through `expo-store-review`.** The popup lets people
  rate in two seconds without leaving the app, so it gets far more ratings than a button in Settings. It needs native
  code, so it ships with the 1.3.7 App Store build, not by OTA.
- **Two happy moments can ask: saving a title, and rating one 8 or higher.** Both ways to save count: the Save button
  and moving a title from Seen to Saved. Pressing "Submit" without moving the rating slider counts too, because the
  slider starts at 10.
- **Meowie asks at most once every 90 days per phone, whichever moment comes first.** `reviewAskedAtAtom` keeps the time
  of the last ask, so saves and ratings don't use up Apple's 3 popups a year and the person isn't asked over and over.
  The phone only knows about asks after this update, so everyone gets one ask at their next happy moment.
- **Apple still decides whether the popup shows**, at most 3 times in any 365 days. Apple doesn't tell the app whether
  it showed or what the person tapped, so "Not Now" can't be recorded.
- **`useAskForReview` in `../../features/media/components/info/elements/use-ask-for-review.ts` is the one place that asks**, used by both
  `seen.tsx` and `save.tsx`.
- **The check is `isAvailableAsync`, not `hasAction`.** `hasAction` is also true when an `appStoreUrl` is set, and then
  `requestReview` opens the App Store instead of the popup, like in TestFlight.
- **The e2e flow that rates a title dismisses the popup if it shows**, because it saves the default 10.
