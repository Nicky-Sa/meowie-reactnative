const path = require("path");
const { withNativeWind } = require("nativewind/metro");
const { getPostHogExpoConfig } = require("posthog-react-native/metro");

// 📦 Get base config
const config = getPostHogExpoConfig(__dirname);

// 🖼️ SVG support (use transformer, remove from assetExts, add to sourceExts)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts = [
  ...new Set([...config.resolver.sourceExts, "svg"]),
];

// 🪄 Add aliases (e.g., "@" -> project root)
config.resolver.alias = {
  ...config.resolver.alias,
  "@": __dirname,
};

// 🌱 Log envs (for verification/debugging)
console.log(
  "Env variables: ",
  Object.entries(process.env).map(
    ([key, value]) => `${key}: ${value?.toString().slice(0, 8)}***`,
  ),
);

// 🌈 Combine with NativeWind
module.exports = withNativeWind(config, {
  input: "./styles/global.css",
  projectRoot: __dirname,
  inlineRem: false,
  features: {
    transformPercentagePolyfill: true,
  },
});
