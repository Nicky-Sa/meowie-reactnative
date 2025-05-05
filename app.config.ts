import { ExpoConfig } from "expo/config";
import { withSentry } from "@sentry/react-native/expo";

const config: ExpoConfig = {
  name: "Meowie",
  slug: "meowie",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.nicky-sa.meowie",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo.png",
      backgroundColor: "#ffffff",
    },
    package: "com.nicky_sa.meowie",
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
