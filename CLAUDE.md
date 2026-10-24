# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Expo (React Native) mobile app for Meowie. This file is auto-loaded when working in `meowie-reactnative/`; the monorepo root `../CLAUDE.md` covers the backend.

## Commands

```bash
npm run start            # expo start --clear --dev-client --lan
npm run lint             # eslint (whole project, no auto-fix). Use `npx eslint --fix` to fix.
npm run generate:api     # Orval codegen from backend Swagger at localhost:5005/docs-json (see Data fetching caveat)
npm run prebuild         # expo prebuild --clean
npm run android | ios    # expo run:android | run:ios

# EAS builds (local) — each pulls EAS env first via `eas env:pull --environment <env>`
npm run eas-build:local-development:{android,ios-simulator,ios-device}
npm run eas-build:local-preview:{android,ios-device}
npm run eas-build:testflight-{preview,production}

# OTA updates (iOS only); message is required after `--`
npm run eas-update:preview:ios -- "what changed"     # or eas-update:production:ios

npm run generate-figma-variables   # Export Figma design tokens (see README "Design system")
```

`npm run start` requires a **dev build** already installed on the device/simulator (Expo Go won't work, despite the README). The pre-commit hook (`.husky/pre-commit`) runs `tsc` then `npm run lint` — keep types clean.

Path alias: `@/*` → repo root (`tsconfig.json`).

## Architecture

**Routing.** Expo Router, file-based, with typed routes (`app.config.ts` → `experiments.typedRoutes`). Files in `app/` are thin wrappers; the real screens live in `features/`. Every stack screen **and its transition animation** is declared centrally in `app/_layout.tsx` — register new top-level routes there.

**Provider stack** (outer → inner, from `app/_layout.tsx`): `View` → PostHogProvider (+ `UpdatesListener`) → PostHogSurveyProvider → ScreenTracker → EventListenerWrapper → ThemeProvider → QueryClientProvider → KeyboardProvider → SafeAreaProvider → GestureHandlerRootView → BottomSheetModalProvider → InternetCheck → TourGuideProvider → Stack. A global `Toast` and a `PortalHost` named `"global-overlay"` sit alongside the Stack.

**Feature modules.** `features/<domain>/` holds that domain's screen(s), sub-components, and a `data/` folder (fetch hooks + a `dto/` subdir of hand-written response types). Shared primitives live in `features/common/` (`ui/`, `layout/`, `posters/`, `tab/`, `form/`, `data/`, `event-emitting/`, `hooks/`).

**Screen files are always named `screen.tsx`.** Every routed screen is a `screen.tsx` under its own directory — `features/<domain>/screen.tsx` for the domain's main screen, `features/<domain>/<sub>/screen.tsx` for each additional screen (e.g. `features/settings/delete-user/screen.tsx`, `features/taste/steps/movies/screen.tsx`). It exports `export const Screen`, and the matching `app/` route file is a thin wrapper: `import { Screen } from "@/features/<domain>/.../screen"` re-exported as the route's default component. Never name a screen file after the screen (`pick-movies.tsx`); the directory carries the name, the file is `screen.tsx`.

**Data fetching — hand-written, not Orval.** Despite `orval/orval.config.ts`, the generated client is **unused**: `orval/generated/` is gitignored/empty, `orval/axios-instance.ts` does not exist, and nothing imports `customInstance` or the generated hooks. Don't assume generated hooks exist. The real layer:
- `features/common/data/axios.ts` — one Axios instance. Request interceptor auto-prefixes `/v1` to versionless URLs, attaches the `Bearer` access token, and adds an `x-user-country` header read from `countryCodeAtom` via `getDefaultStore()`. Response interceptor runs a single-flight 401 → refresh-token flow with a queued-request backlog; a 403 on refresh destroys the session and downgrades to guest, while transient failures keep the tokens.
- `features/common/data/fetcher.ts` — wraps the instance and unwraps the backend envelope (returns `data`, throws the `errors` string).
- `features/common/data/query/hooks.ts` — the hooks features actually use: `useQueryConfigured`, `useQueryPaginatedConfigured`, `useMutationConfigured`, `useInvalidateByPattern`. Query keys are `[url]`.
- Per-feature hooks (e.g. `features/media/movie/data/use-fetch-movie-info.ts`) call those with a URL + a DTO type from `features/<domain>/data/dto/`, then return `response.data`.
- `features/common/data/query/client.ts` — the `QueryClient` (staleTime 10m, gcTime 30m; never retries 401, otherwise up to 3 with a 3s delay) and wires React Query's `focusManager`/`onlineManager` to RN `AppState` + NetInfo so queries refetch on app-foreground and reconnect.

Backend response envelope (`features/common/data/transformers.ts`): success `{ success: true, statusCode, data, timestamp }`, error `{ success: false, statusCode, errors, timestamp }`.

**State.** Jotai (`atoms/`). `atoms/storage.ts` exports `atomPersisted` / `atomPersistedWithImmer`, backed by **MMKV** (`react-native-mmkv`, store id `persisted-atoms`) — not AsyncStorage. In-memory complex state uses `jotai-immer`'s `atomWithImmer`. Non-React code reads/writes atoms via `getDefaultStore()`. Forms use React Hook Form with a zod resolver.

**Styling.** NativeWind v4 (Tailwind for RN). `tailwind.config.ts` is large and generated from Figma tokens. `lib/tailwind.ts` exports `cn()` (clsx + tailwind-merge) and a resolved `tailwind` config object used to read theme values in JS (e.g. seeding a color atom). `styles/global.css` is imported in the root layout.

**Env & build variants.** `lib/env.ts` validates `EXPO_PUBLIC_*` vars with `@t3-oss/env-core` + zod (each var must be manually listed in `runtimeEnv` or Metro won't inline it). `EXPO_PUBLIC_APP_VARIANT` (`development` | `preview` | `production`) drives bundle id, app name, and URL scheme in `app.config.ts`. Build/release env comes from EAS (`eas env:pull --environment <env>`, baked into the build scripts); the EAS development `EXPO_PUBLIC_BACKEND_URL` points at the dev Mac's `.local` name (`http://<mac-name>.local:5005`), so it keeps working when the Mac's IP changes. JS and the Swift Siri code (`app-intents/`, via the `MeowieBackendUrl` Info.plist key) both use it.

**Auth / session.** OTP (email) plus Google / Apple sign-in. Tokens live in `expo-secure-store` with an in-memory cache (`features/common/data/utils/token.ts`). `session` / `destroySession` (in `data/utils/`) manage tokens and emit `sessionCreated` / `sessionDestroyed` over a `mitt` bus (`features/common/event-emitting/emitter.ts`), consumed by `EventListenerWrapper`. No tokens = guest mode; the Axios layer downgrades to guest silently when a refresh fails.

**Observability.** PostHog only — analytics, session replay (10% sample, text inputs and images masked), and error tracking. The client and these settings live in `features/general/posthog/client.ts`; `app/_layout.tsx` only mounts `PostHogProvider` with touch and screen autocapture. Error tracking catches uncaught exceptions, unhandled promise rejections and every `console.error` call (ours and libraries'), so log a caught error with `console.error` to report it. There is **no Sentry**. `ScreenTracker` reports navigation.

**Adding a PostHog event.** Add its type to `features/general/posthog/events.ts` and a tracker to `features/general/posthog/hook/use-analytics.ts`. Then add a row for it in the Notion table "🐾 Tracking Event - Posthog" (https://app.notion.com/p/358b1b85bdfe801696bdebf656b666d8), following the other rows' style. When you rename or remove an event, update its row too.

**OTA updates.** EAS Update; `UpdatesListener` (in the provider tree) downloads and reloads updates on launch. `runtimeVersion.policy` is `appVersion`. Update scripts are iOS-only.

## Skills

`.agents/skills/` holds Expo task playbooks (building native UI, deployment, EAS update insights, upgrading Expo, native data fetching, dev client). Consult the relevant `SKILL.md` when doing one of those tasks.


## Conventions

- **Never use single-letter variable names.** Give every binding a full, readable name
  that says what it holds — `component` not `c`, `series` not `s`, `movie` not `m`.
  The only exception is a conventional loop index `i`/`j` in a plain counting `for` loop.
- **Never pass a `Button` an `onPress` that can throw or reject.** `Button` (`features/common/ui/button.tsx`)
  runs `onPress` without catching errors, so the handler must catch its own and show feedback (a toast) or log them with `console.error`.