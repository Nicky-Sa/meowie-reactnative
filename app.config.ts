import { ExpoConfig } from "expo/config";
import { withSentry } from "@sentry/react-native/expo";

const APP_VARIANT = process.env.APP_VARIANT;

const getUniqueIdentifier = () => {
  let bundleIdentifier: string;

  switch (APP_VARIANT) {
    case "development":
      bundleIdentifier = "com.meowie.app.dev";
      break;
    case "preview":
      bundleIdentifier = "com.meowie.app.preview";
      break;
    default:
      bundleIdentifier = "com.meowie.app";
  }

  console.log({ bundleIdentifier });
  return bundleIdentifier;
};

const getAppName = () => {
  let appName: string;

  switch (APP_VARIANT) {
    case "development":
      appName = "Meowie (dev)";
      break;
    case "preview":
      appName = "Meowie (preview)";
      break;
    default:
      appName = "Meowie";
  }

  console.log({ appName });
  return appName;
};

const config: ExpoConfig = {
  name: getAppName(),
  slug: "meowie",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo-splash.png",
        imageWidth: 250,
        resizeMode: "contain",
        backgroundColor: "#151515",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "c041071d-3986-482a-b8ad-ae46ac74dd4a",
    },
  },
  owner: "nicky_sa",
  updates: {
    url: "https://u.expo.dev/c041071d-3986-482a-b8ad-ae46ac74dd4a",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};

export default withSentry(config, {
  url: process.env.SENTRY_URL,
  project: process.env.SENTRY_PROJECT,
  organization: process.env.SENTRY_ORG,
});
