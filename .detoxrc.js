/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "ios.local": {
      type: "ios.app",
      build: "npm run eas-build:detox:ios",
      binaryPath: `local-builds/detox/ios/${process.env.CUSTOM_BINARY_APP_NAME || "Meowiepreview"}.app`,
    },
    "android.local": {
      type: "android.apk",
      build: "npm run eas-build:detox:android",
      binaryPath: "local-builds/detox/android/app-debug.apk", // Depends on exact name output by EAS
      testBinaryPath: "local-builds/detox/android/app-debug-androidTest.apk",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 17",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_4_API_30",
      },
    },
  },
  configurations: {
    "ios.sim.local": {
      device: "simulator",
      app: "ios.local",
      utilizeBinary: true,
      session: {
        autoStart: true,
      },
    },
    "android.emu.local": {
      device: "emulator",
      app: "android.local",
    },
  },
};
