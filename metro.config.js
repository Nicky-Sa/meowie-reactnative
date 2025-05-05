const path = require("path");
const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { env } = require("./env.ts");

// 🌱 Log envs (for verification/debugging)
console.log(
  "Custom env variables loaded: ",
  Object.entries(env).map(
    ([key, value]) => `${key}: ${value?.toString().slice(0, 3)}***`,
  ),
  "Other env variables: ",
  Object.entries(process.env).map(
    ([key, value]) => `${key}: ${value?.toString().slice(0, 8)}***`,
  ),
);

// 📦 Get base Sentry config (with Expo + Debug ID support)
const config = getSentryExpoConfig(__dirname, {
  isCSSEnabled: true,
});

// 📂 Monorepo support
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
config.watchFolders = [workspaceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

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
  "@": __dirname,
};

// 🌈 Combine with NativeWind
module.exports = withNativeWind(config, {
  input: "./styles/global.css",
  projectRoot,
  inlineRem: false,
  features: {
    transformPercentagePolyfill: true,
  },
});
