# Package updates

## Decisions

- **Packages that Expo fixes for SDK 58 stay at Expo's versions.** These are `react`, `react-dom`, `lottie-react-native`, `@shopify/flash-list`, `react-native-gesture-handler`, `react-native-keyboard-controller`, `react-native-pager-view`, `react-native-svg` and `react-native-worklets`. Their versions come from `expo/bundledNativeModules.json`, and `npx expo install --check` must stay clean.
- **`eslint` and `@eslint/js` stay on 9.** `eslint-plugin-react` supports ESLint only up to 9.
- **`typescript` stays on 6.0.** `typescript-eslint` supports TypeScript only below 6.1.
- **`tailwindcss` stays on 3.** NativeWind v4 is built for Tailwind 3.
- **Each major update gets its own step, and its changelog is read first.** This covers `@hookform/resolvers` 7, `react-native-reanimated-carousel` 5, `@react-native-google-signin/google-signin` 17, `@posthog/cli` 0.20 and `eslint-import-resolver-typescript` 4.
- **`@hookform/resolvers` 7 needs no code change.** The breaking changes in 6 and 7 only touch the effect-ts and TypeBox resolvers, and the app only uses `zodResolver`, whose source is the same as in 5.9.2.
- **`@hookform/resolvers` no longer has to stay on 5.** It was kept there because npm refused to install 6.0.0 over a clash between optional extras, and 6.0.1 removed that clash.
- **`react-native-reanimated-carousel` moves to 5.** Nothing technical blocked it before, only the size of the change. Version 5.2 also stops the carousel from causing the "Dependencies should only be used on the web" warning.
- **The onboarding dots use v5's own `Pagination` with `activeDotStyle`, not a hand-built indicator.** It grows the active dot from `dotStyle` to `activeDotStyle`, which keeps the wide active dot. The old `customReanimatedStyle` moved the dots by 0 points, so dropping it changes nothing.
- **A dot tap calls `scrollTo({ index })`.** The carousel doesn't loop, so the old `count` sum isn't needed, and v5 animates by default.
- **`@types/node` follows the Node major we run, which is 24.** A newer `@types/node` describes Node features our Node doesn't have, so TypeScript wouldn't catch code that fails when it runs.
- **Google Sign-In keeps CocoaPods, its default, for the iOS SDK.** Version 17 can use Swift Package Manager instead, but nothing in the app needs it.
