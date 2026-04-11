const path = require("path");

const { withNativeWind } = require("nativewind/metro");
const { getPostHogExpoConfig } = require("posthog-react-native/metro");

// 📂 Project root for Metro config
const projectRoot = __dirname;

// 📦 Get base config
const config = getPostHogExpoConfig(projectRoot);

// 🪽 Support cjs files
config.resolver.sourceExts.push("cjs");

config.watchFolders = [projectRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

// 🖼️ SVG support (use transformer, remove from assetExts, add to sourceExts)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.assetExts.push("png"); // add png if needed
config.resolver.sourceExts = [
  ...new Set([...config.resolver.sourceExts, "svg"]),
];

// 🪄 Add aliases (e.g., "@" -> project root)
config.resolver.alias = {
  ...config.resolver.alias,
  "@": projectRoot,
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
  projectRoot,
  inlineRem: false,
  features: {
    transformPercentagePolyfill: true,
  },
});
