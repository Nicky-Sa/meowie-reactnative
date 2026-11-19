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
- **Meowie doesn't try to skip people who already rated.** Apple's guidelines say the system checks for earlier
  feedback and shows the popup only when there is none, so asking again after 90 days doesn't bother them.
- **PostHog gets a `review_requested` event each time Meowie asks Apple**, with `reason` (`save` or `rating`) and the
  title. It means "Meowie asked", not "the popup showed". No event is sent when the 90 days aren't up, or when Apple
  doesn't allow the popup, like in TestFlight. Whether the asks work shows in the App Store Connect rating count.
- **`useAskForReview` in `features/media/components/info/elements/use-ask-for-review.ts` is the one place that asks**,
  used by both `seen.tsx` and `save.tsx`.
- **The check is `isAvailableAsync`, not `hasAction`.** `hasAction` is also true when an `appStoreUrl` is set, and then
  `requestReview` opens the App Store instead of the popup, like in TestFlight.
- **The e2e flow taps "Not Now" if the popup shows after the first save.** Each run starts with `clearState`, so the
  first save always asks, and the 90-day limit stops the rating and the second run from asking again.
