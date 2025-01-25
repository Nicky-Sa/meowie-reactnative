const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// 1. Enable CSS for Expo.
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});
config.resolver.assetExts.push("png");

// This is not needed for NativeWind, it is configuration for Metro to understand monorepos
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
config.watchFolders = [workspaceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 2. Enable NativeWind
const { withNativeWind } = require("nativewind/metro");

// 3. Enable react-native-svg-transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = withNativeWind(
  {
    ...config,
    resolver: {
      ...config.resolver,
      alias: {
        "@": __dirname, // Alias for the root directory
      },
    },
  },
  {
    // 4. Set `input` to your CSS file with the Tailwind at-rules
    input: "./styles/global.css",
    // This is optional
    projectRoot,
    inlineRem: false,
    features: {
      transformPercentagePolyfill: true,
    },
  },
);
