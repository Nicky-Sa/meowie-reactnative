# Push notifications

Sessions: `46b1f770-311e-4d3e-83a2-21fe633a44b8`, `9d355021-08e0-4033-b2ea-25b1c5b3711d`,
`b57f03af-6fc5-4808-93c9-d6f1df912b82`, `2393394e-44d3-4470-9f42-36851f5e27a0`

## Decisions

- **Push notifications come first, local ones may come later.** The backend decides what to send, which needs push.
- **`expo-notifications` handles both push and local notifications.** Adding local ones later needs no new package and
  no new store build, because the native code is already in the app.
- **The plugin uses its default settings.** Remote notifications are on by default, which adds the iOS push
  entitlement. The other options are Android-only or not needed yet.
- **This work covers setup only, not what the notifications say.** The content is decided separately.
- **The app sends the phone's time zone to the backend.** Without it, the backend can't send at a set local time like
  7pm.
- **The time zone goes on every request as the `x-time-zone` header, like `x-device-code`.** It describes the phone the
  request comes from, and other endpoints will likely need it later.
- **The notifications sheet shows at whichever comes first: the sixth card in the Movies or Series feed, or the second
  visit to the Explore tab.** By then the user has seen what Meowie offers, so it's easier to see why notifications
  help. The feed already knows its current card, and the Explore visits are counted on the phone.
- **The sheet shows once per phone, and only while iOS hasn't asked about notifications yet.** A saved value remembers
  that it showed, so "Skip for now" doesn't bring it back after more scrolls.
- **The sheet is built on `BottomSheet`, whose `title` is now optional.** The design starts with the bell picture and
  a big centered title, so the sheet's own title row at the top left has to be left out.
- **The Home tour doesn't wait for the sheet.** The tour and the scroll hint play on the first card, before any
  scrolling, so they never meet the sheet.
- **The app gets the push token only once it can send it to the backend.** Nothing can receive the token before then.
- **Push tokens live in a new `devices` table with one row per phone.** A push token and a time zone belong to a
  phone, not to a person. Each row always has the `deviceCode` the app sends as `x-device-code`, and `userId` only
  while someone is signed in on that phone. Signing out empties `userId` but keeps the row, so guests can get
  notifications too.
- **`devices` keeps both `deviceCode` and `userId`, unlike `feeds` and `taste`.** Those belong to a person and get a
  guest row and an account row from the same phone, so a shared `deviceCode` would clash with their unique rule. A
  phone has only one `devices` row, so that clash can't happen.
- **`feeds` and `taste` keep their own `deviceCode` column for now.** Moving them to a `deviceId` would add a lookup on
  every guest request and a migration, so it gets its own discussion at the end.
- **The backend stores when the app was last opened, in `lastOpenedAt` on `devices`.** PostHog records app opens, but
  the backend can't easily use PostHog data when it decides what to send. Keeping it on the phone's row instead of on
  `users` means guests have it too.
- **The app saves its `devices` row on every open and every return to the front, with no separate last-open call.**
  The backend sets `lastOpenedAt` in the same save, so one request covers the token, the time zone and the last open.
- **The app's save is `savePushToken`, and it calls `PUT /v1/device/current/push-token`.** The sheet and the Settings
  toggle call it directly right after "Allow", with no event, so the name says what changed. An event would add code
  only to avoid a direct call. Saving the phone's row itself may move elsewhere later, like when guest tokens are
  issued.
- **The start screen calls `savePushToken()` directly on a fresh open.** `AppState` sends no change when the app starts,
  because it is already active before the listeners start.
- **`useAppEnteredForeground` saves only when the app goes from "background" to "active".** iOS popups, like the
  permission question, move the app through "inactive" only, so they don't cause a save.
- **`useSessionCreated` and `useSessionDestroyed` call `savePushToken()` until the guest tokens step.** The call sets or
  empties `userId` on the phone's row. Moving that into the backend's sign in and logout is discussed in that step.
- **Every `useMutationConfigured` hook returns a named function plus `...rest`, like `{ submitTaste, ...rest }`.**
  `useSavePushToken` follows the media hooks, so the older `trigger` hooks and the sign in hooks now match them too.
- **The taste result screen's own wrapper is `finishTaste`.** It submits, waits for the animation and moves on, so it
  can't share the hook's `submitTaste` name.
- **React Query's own `AppState` listener in `client.ts` moves to its own hook in a separate ticket.** It needs every
  state change, so it doesn't belong in `useAppEnteredForeground`.
- **Every phone saves its row, even without permission for notifications.** It sends `pushToken: null` then, so the
  backend still has its time zone and last open, and a later "Allow" in the iPhone Settings app fills the token on the
  next open.
- **Guests keep getting pushes until guest tokens exist.** Faking a phone needs a device code leaked from PostHog or
  the server logs, and it only hurts if a push shows personal details, so the risk is low.
- **The trailer pauses while the notifications sheet is open.** The sheet turns off `allowYTPlayingAtom`, and closing
  it turns it back on. A trailer the user paused stays paused after the sheet closes.
- **Settings gets a toggle for notifications.** A tap on it sends a PostHog event that says whether it turned on or
  off.
- **The toggle shows whether iOS allows Meowie's notifications.** While iOS can still ask, a tap shows the iOS popup.
  Otherwise a tap opens Meowie's notification settings in the iPhone Settings app, because an app can't turn its own
  permission on or off, and iOS never shows the popup again after "Don't Allow". The toggle reads the permission
  again when the user comes back.
- **On phones shorter than `tall-sm`, the notifications sheet uses a smaller cat and smaller gaps.** At full size the
  sheet is taller than an iPhone SE, which cuts off its top and the "Skip for now" button.
- **A tap on a push notification opens the app path in its `data.url`, like `/movie/27205/details`.** It works like a
  Siri link: on the start screen it goes through `linkToOpenAtom`, so Home loads under it, and elsewhere it uses
  `router.push`.
- **`useNotificationTapped` in `useEventListener` handles the tap, and also reads the last tap when it starts.** A tap
  that opened a fully closed app comes before the listener exists.
- **`isAppPath` checks that a link is an app path, instead of an `as Href` cast.** `+native-intent.tsx` uses it too.
- **A tap sends the PostHog event `push_notification_opened` with the opened path.**
