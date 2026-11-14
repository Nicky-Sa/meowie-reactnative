# Release hardening

## Decisions

- **End-to-end tests use Maestro, run on a simulator build.** Expo's docs recommend it, and it needs no library inside the app, so it changes nothing about how releases go out.
- **The app's dev build turns off PostHog error tracking only.** Analytics and session replay stay on in development. Dev-only errors, like a missing native module on an old dev build, were filling the error list.
- **An error without a stack trace is grouped by its message, through `before_send` in `features/general/posthog/client.ts`.** PostHog gave every such error the same fingerprint, so different problems landed in one row. PostHog grouping rules were dropped because they need one rule per kind of error.
- **A render error is caught by a per-screen boundary, with the root `ErrorBoundary` as the backup.** The per-screen one keeps the rest of the app working. Its setting is named "unstable", and nothing fails if an Expo update drops it, so the root one stays as a backup and also covers layouts and providers.
- **The error screen uses `InnerScreen` when there is a screen to go back to.** The broken screen's own header goes away with it, so without this the back arrow is lost. On a screen with nothing behind it, like Home, the error screen keeps only "Try again".
- **The error screen shows the default text, not the error.** A render error's message is a programmer message, like "TypeError: undefined is not an object". PostHog still gets the full error.
- **The error boundaries don't send the error to PostHog themselves.** React Native already logs a caught render error with `console.error`, and PostHog's console capture reports it once, with its stack trace. Sending it again would count it twice.
- **Lint runs `no-floating-promises` and `no-misused-promises`, but skips handlers passed to props like `onPress`.** Most of those handlers already catch their own errors, and checking them would need a wrapper on about 30 of them. The lint takes about 3 seconds longer, because these rules read type information.
- **A call that can't fail gets `void` and a comment saying why, not a `.catch`.** The trailer player's calls, the volume reading and `useRefreshQuery`'s refresh all only ever resolve, so a `.catch` on them could never run.
- **The Google and Apple sign-in failure toasts point the person to the email code login.** Both fail on some devices with errors the app can't fix, and the email code still works there.
