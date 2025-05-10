# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

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


- [development build](https://docs.expo.dev/develop/development-builds/introduction/): can be done for android (both device and emulator at the same time) and ios-simulator and ios-device.
  - **[Android](https://docs.expo.dev/tutorial/eas/android-development-build/)**: 
    - Device
      - Connect your Android device to the android-studio using Wi-Fi, pair the device using the 'Running Devices' option on the right panel.
    - [Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
      - Make sure you've downloaded at least one Android simulator in the Android Studio.
    - Open the "Orbit" on Mac and select the detected device or simulator (its icon should have a blue background). 
    - Create a build:
       ```bash
      npm run eas-build:android
        ```
    - Select Y at the end of build to open the emulator or Open the build in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds) and click on 'Open with Orbit'. 
    - Have the app running via:
        ```bash
          npm run start
        ```
    - Select the local server on the device or emulator.
  - **[iOS simulator](https://docs.expo.dev/tutorial/eas/ios-development-build-for-simulators/)**: 
    - Create a build:
       ```bash
      npm run eas-build:ios-simulator
        ```
    - Select Y at the end of build to open the simulator or Open the build in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds) and click on 'Open with Orbit'.
  - **[iOS device](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/)**: 
    - Create a build:
       ```bash
      npm run eas-build:ios-device
        ```
    - Open the build in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds) and click on 'Open with Orbit' or scan the QR code.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

Note to self:

You can create builds for EAS in 2 ways: local (using your own laptop resources), cloud (using EAS resources).
- local: follow, interrupt and see logs of the build in your terminal. Use `--local` in any of the build commands.
- cloud: follow, interrupt and see logs of the build in [EAS dashboard](https://expo.dev/accounts/nicky_sa/projects/meowie/builds)

There are many hooks than can run commands before and after the build. Follow them [here](https://docs.expo.dev/build-reference/npm-hooks/)

## Upload sourcemap to Sentry
Make sure the ./sentryclirc file is configured correctly:
```
[auth]
token=sntrys_...
```
