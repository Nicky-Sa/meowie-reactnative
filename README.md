# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [
`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. (Build and) Start the app:

- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo:

  ```bash
   npm run start
  ```

  and then scan the QR code with the Expo Go app.

- [development build](https://docs.expo.dev/develop/development-builds/introduction/): can be done for android (both
  device and emulator at the same time) and ios-simulator and ios-device.
    - **[Android](https://docs.expo.dev/tutorial/eas/android-development-build/)**:
        - Device
            - Connect your Android device to the android-studio using Wi-Fi, pair the device using the 'Running Devices'
              option on the right panel.
        - [Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
            - Make sure you've downloaded at least one Android simulator in the Android Studio.
        - Open the "Orbit" on Mac and select the detected device or simulator (its icon should have a blue background).
        - Create a build:
          ```bash
          npm run eas-build:local-development:android
          ```
        - Select Y at the end of build to open the emulator or Open the build
          in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds) and click on 'Open with Orbit'.
        - Have the app running via:
          ```bash
            npm run start
          ```
        - Select the local server on the device or emulator.
    - **[iOS simulator](https://docs.expo.dev/tutorial/eas/ios-development-build-for-simulators/)**:
        - Create a build:
          ```bash
          npm run eas-build:local-development:ios-simulator
          ```
        - Select Y at the end of build to open the simulator or Open the build
          in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds) and click on 'Open with Orbit'.
    - **[iOS device](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/)**:
        - Create a build:
          ```bash
          npm run eas-build:local-development:ios-device
          ```
        - Open the build in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds) and click on '
          Open with Orbit' or scan the QR code.

You can start developing by editing the files inside the **app** directory. This project
uses [file-based routing](https://docs.expo.dev/router/introduction).

Note to self:

You can create builds for EAS in 2 ways: local (using your own laptop resources), cloud (using EAS resources).

- local: follow, interrupt and see logs of the build in your terminal. Use `--local` in any of the build commands.
- cloud: follow, interrupt and see logs of the build
  in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds)

There are many hooks than can run commands before and after the build. Follow
them [here](https://docs.expo.dev/build-reference/npm-hooks/)

> **⚠️ EAS Local Build on macOS:** Local builds require `EAS_LOCAL_BUILD_WORKINGDIR` to be set to a non-symlinked path (
> e.g. `$HOME/tmp/eas-build`). This avoids `/tmp` → `/private/tmp` symlink mismatches that break Metro resolution.
> Add `export EAS_LOCAL_BUILD_WORKINGDIR="$HOME/tmp/eas-build"` to your `~/.zshrc`. If a build fails mid-way, clean the
> directory before retrying: `rm -rf ~/tmp/eas-build && mkdir ~/tmp/eas-build`.

## Testing

There are two primary testing strategies set up in this project.

### 1. Unit & Component Testing (React Native Testing Library + Jest)

These tests run instantly in your terminal (using Node) and are responsible for asserting smaller units of logic, custom
hooks, and verifying components render text and interact correctly when given mocked data.

**To run logic/component tests:**

```bash
npm run test:unit
```

### 2. End-to-End Testing (Detox)

Unlike Jest, Detox runs on the actual compiled native binary (simulator/emulator). It clicks, scrolls, and types like a
real human. Use this for covering your main critical user paths (e.g. Onboarding, Login).

E2E testing requires building the actual app before passing it to Detox to run the device simulations.

**To run on iOS Simulator:**

- For Preview builds (they won't change if the code changes)

```bash
# 1. Build the app binary for Detox using the preview environment variables
npm run eas-build:detox-preview:ios

# 2. Run the detox tests
npm run test:e2e-preview:ios
```

- For Development builds (they will change if the code changes)

```bash
# 1. Build the app binary for Detox using the preview environment variables
npm run eas-build:detox-development:ios

# 2. Run the detox tests
npm run test:e2e-development:ios
```

**To run on Android Emulator:**

- For Preview builds (they won't change if the code changes)

```bash
# 1. Build the app binary for Detox using the preview environment variables
npm run eas-build:detox-preview:android

# 2. Run the detox tests
npm run test:e2e-preview:android
```

- For Development builds (they will change if the code changes)

```bash
# 1. Build the app binary for Detox using the preview environment variables
npm run eas-build:detox-development:android

# 2. Run the detox tests
npm run test:e2e-development:android
```

## OTA Updates (EAS Update)

This project is configured to use [EAS Update](https://docs.expo.dev/eas-update/introduction/) for over-the-air (OTA)
updates. This allows you to push JS-only changes (like bug fixes or UI updates) instantly without resubmitting to the
App Store.

**Important 1**: Currently, only **iOS** updates are supported by these scripts.
**Important 2**: Make sure the version in `package.json` matches your target version. You can revert that change after
the update.

To push an update, you must provide a message describing your changes. Use the `--` separator to pass the message to the
command:

```bash
# For Development (Internal)
npm run eas-update:development:ios -- "your message"

# For Preview (TestFlight)
npm run eas-update:preview:iospreview -- "your message"

# For Production (App Store)
npm run eas-update:production:iospreview -- "your message"
```

The app includes an `UpdatesListener` that will automatically detect these updates on launch, download them in the
background, and reload the app to apply them.

## Design system

1. To export all figma variables and primitives,
   use [Export Variables (CSS, SCSS, Tailwind)](https://www.figma.com/community/plugin/1382804904426179542/export-variables-css-scss-tailwind)
   plugin
2. Update `/figma/input.ts`
3. Run `npm run generate-figma-variables`
4. Check `/figma/output.ts` and extract what you need to `tailwind.config.ts`