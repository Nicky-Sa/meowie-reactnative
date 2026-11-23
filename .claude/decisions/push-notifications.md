# Push notifications

Sessions: `46b1f770-311e-4d3e-83a2-21fe633a44b8`

## Decisions

- **Push notifications come first, local ones may come later.** The backend decides what to send, which needs push.
- **`expo-notifications` handles both push and local notifications.** Adding local ones later needs no new package and
  no new store build, because the native code is already in the app.
- **The plugin uses its default settings.** Remote notifications are on by default, which adds the iOS push
  entitlement. The other options are Android-only or not needed yet.
- **This work covers setup only, not what the notifications say.** The content is decided separately.
- **The app sends the user's time zone together with the push token.** Without it, the backend can't send at a set
  local time like 7pm.
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
