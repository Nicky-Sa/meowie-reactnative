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
- **The backend stores when the user last opened the app.** PostHog records app opens, but the backend can't easily use
  PostHog data when it decides what to send.
