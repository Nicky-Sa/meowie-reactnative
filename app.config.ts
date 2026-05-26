import { ExpoConfig } from "expo/config";
import pkg from "./package.json";

const APP_VARIANT = process.env.EXPO_PUBLIC_APP_VARIANT;
const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

// READ THE VERSION FROM ENV
// If the CI didn't provide one (local dev), fall back to the version from package.json
const SYSTEM_VERSION = (process.env.APP_VERSION || pkg.version)
  .replace(/^v/, "")
  .split("-")[0];

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

const getScheme = () => {
  let scheme: string;

  switch (APP_VARIANT) {
    case "development":
      scheme = "meowie-dev";
      break;
    case "preview":
      scheme = "meowie-preview";
      break;
    default:
      scheme = "meowie";
  }

  return scheme;
};

const getPlugins = (): ExpoConfig["plugins"] => {
  const pluginsList: ExpoConfig["plugins"] = [
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    "expo-router",
    "expo-localization",
    "expo-secure-store",
    [
      "expo-asset",
      {
        assets: ["./assets"],
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo/logo-splash.png",
        imageWidth: 150,
        resizeMode: "contain",
        backgroundColor: "#0A0A0A",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    "posthog-react-native/expo",
    "@config-plugins/detox",
    "expo-apple-authentication",
  ];

  // conditional plugins
  if (iosUrlScheme) {
    pluginsList.push([
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme,
      },
    ]);
  }

  return pluginsList;
};

const config: ExpoConfig = {
  name: getAppName(),
  slug: "meowie",
  version: SYSTEM_VERSION,
  orientation: "portrait",
  icon: "./assets/images/logo/logo-large.png",
  scheme: getScheme(),
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: false,
    requireFullScreen: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
      "UISupportedInterfaceOrientations~ipad": [
        "UIInterfaceOrientationPortrait",
        "UIInterfaceOrientationPortraitUpsideDown",
      ],
      UIViewControllerBasedStatusBarAppearance: true,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo/logo-foreground.android.png",
      backgroundImage: "./assets/images/logo/logo-background.android.png",
    },
    package: getUniqueIdentifier(),
    softwareKeyboardLayoutMode: "pan",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo/logo-large.png",
  },
  plugins: getPlugins(),
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

export default config;
