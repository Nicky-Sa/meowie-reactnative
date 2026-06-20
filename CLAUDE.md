# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Expo (React Native) mobile app for Meowie. This file is auto-loaded when working in `meowie-reactnative/`; the monorepo root `../CLAUDE.md` covers the backend.

## Commands

```bash
npm run start            # Write LAN IP into .env.local, then `expo start --clear --dev-client --lan`
npm run lint             # eslint (whole project, no auto-fix). Use `npx eslint --fix` to fix.
npm run test:unit        # Jest in WATCH mode (jest --watchAll)
npm run generate:api     # Orval codegen from backend Swagger at localhost:5005/docs-json (see Data fetching caveat)
npm run prebuild         # expo prebuild --clean
npm run android | ios    # expo run:android | run:ios

# A single test (the watch script won't exit on its own):
npx jest features/common/ui/button.test.tsx

# EAS builds (local) — each pulls EAS env first via `eas env:pull --environment <env>`
npm run eas-build:local-development:{android,ios-simulator,ios-device}
npm run eas-build:local-preview:{android,ios-device}
npm run eas-build:testflight-{preview,production}

# Detox: build the native binary, THEN run (Detox does not use Metro)
npm run eas-build:detox-development:{ios,android}   # or detox-preview:*
npm run test:e2e-development:ios                     # or test:e2e-preview:{ios,android}

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

**Data fetching — hand-written, not Orval.** Despite `orval/orval.config.ts`, the generated client is **unused**: `orval/generated/` is gitignored/empty, `orval/axios-instance.ts` does not exist, and nothing imports `customInstance` or the generated hooks. Don't assume generated hooks exist. The real layer:
- `features/common/data/axios.ts` — one Axios instance. Request interceptor auto-prefixes `/v1` to versionless URLs, attaches the `Bearer` access token, and adds an `x-user-country` header read from `countryCodeAtom` via `getDefaultStore()`. Response interceptor runs a single-flight 401 → refresh-token flow with a queued-request backlog; a 403 on refresh destroys the session and downgrades to guest, while transient failures keep the tokens.
- `features/common/data/fetcher.ts` — wraps the instance and unwraps the backend envelope (returns `data`, throws the `errors` string).
- `features/common/data/query/hooks.ts` — the hooks features actually use: `useQueryConfigured`, `useQueryPaginatedConfigured`, `useMutationConfigured`, `useInvalidateByPattern`. Query keys are `[url]`.
- Per-feature hooks (e.g. `features/media/movie/data/use-fetch-movie-info.ts`) call those with a URL + a DTO type from `features/<domain>/data/dto/`, then return `response.data`.
- `features/common/data/query/client.ts` — the `QueryClient` (staleTime 10m, gcTime 30m; never retries 401, otherwise up to 3 with a 3s delay) and wires React Query's `focusManager`/`onlineManager` to RN `AppState` + NetInfo so queries refetch on app-foreground and reconnect.

Backend response envelope (`features/common/data/transformers.ts`): success `{ success: true, statusCode, data, timestamp }`, error `{ success: false, statusCode, errors, timestamp }`.

**State.** Jotai (`atoms/`). `atoms/storage.ts` exports `atomPersisted` / `atomPersistedWithImmer`, backed by **MMKV** (`react-native-mmkv`, store id `persisted-atoms`) — not AsyncStorage. In-memory complex state uses `jotai-immer`'s `atomWithImmer`. Non-React code reads/writes atoms via `getDefaultStore()`. Forms use React Hook Form with a zod resolver.

**Styling.** NativeWind v4 (Tailwind for RN). `tailwind.config.ts` is large and generated from Figma tokens. `lib/tailwind.ts` exports `cn()` (clsx + tailwind-merge) and a resolved `tailwind` config object used to read theme values in JS (e.g. seeding a color atom). `styles/global.css` is imported in the root layout.

**Env & build variants.** `lib/env.ts` validates `EXPO_PUBLIC_*` vars with `@t3-oss/env-core` + zod (each var must be manually listed in `runtimeEnv` or Metro won't inline it). `EXPO_PUBLIC_APP_VARIANT` (`development` | `preview` | `production`) drives bundle id, app name, and URL scheme in `app.config.ts`. Build/release env comes from EAS (`eas env:pull --environment <env>`, baked into the build scripts); local dev gets its `EXPO_PUBLIC_BACKEND_URL` from `scripts/set-backend-url-env.ts` (auto-detects your LAN IP into `.env.local`).

**Auth / session.** OTP (email) plus Google / Apple sign-in. Tokens live in `expo-secure-store` with an in-memory cache (`features/common/data/utils/token.ts`). `session` / `destroySession` (in `data/utils/`) manage tokens and emit `sessionCreated` / `sessionDestroyed` over a `mitt` bus (`features/common/event-emitting/emitter.ts`), consumed by `EventListenerWrapper`. No tokens = guest mode; the Axios layer downgrades to guest silently when a refresh fails.

**Observability.** PostHog only — analytics, session replay (10% sample, text inputs and images masked), and autocaptured error tracking — all configured in `app/_layout.tsx`. There is **no Sentry**. `ScreenTracker` reports navigation.

**OTA updates.** EAS Update; `UpdatesListener` (in the provider tree) downloads and reloads updates on launch. `runtimeVersion.policy` is `appVersion`. Update scripts are iOS-only.

## Testing
Ignore it for now, it's not complete yet.

- **Unit / component:** Jest (`jest-expo` preset, `jest.setup.ts`) + React Native Testing Library. Tests are co-located in `features/` as `*.test.tsx`; `e2e/` is excluded via `testPathIgnorePatterns`. `npm run test:unit` is watch-mode — run one file with `npx jest <path>`.
- **E2E:** Detox (`.detoxrc.js`, tests in `e2e/`). Runs against a prebuilt native binary, **not** Metro — build with an `eas-build:detox-*` script before running `test:e2e-*`.

## Skills

`.agents/skills/` holds Expo task playbooks (building native UI, deployment, EAS update insights, upgrading Expo, native data fetching, dev client). Consult the relevant `SKILL.md` when doing one of those tasks.