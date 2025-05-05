import { execSync } from "child_process";

const EAS_BUILD_PROFILE = process.env.EAS_BUILD_PROFILE;
const EAS_BUILD_PLATFORM = process.env.EAS_BUILD_PLATFORM;

console.log(
  `📦 Running build-on-success for profile: ${EAS_BUILD_PROFILE}, platform: ${EAS_BUILD_PLATFORM}`,
);

const sentrySourceMapGenerateAndUpload = () => {
  console.log("⏳ Generating and uploading source maps into Sentry...");

  try {
    switch (EAS_BUILD_PROFILE) {
      case "ios-simulator":
      case "development": {
        // For development release, the versioning is not important, so we use the plain 1.0.0 all the time
        const release = "com.nicky-sa.meowie@1.0.0+1";

        if (EAS_BUILD_PLATFORM === "ios") {
          execSync(
            "npx expo export:embed --entry-file node_modules/expo-router/entry.js --platform ios --dev false --reset-cache --bundle-output main.jsbundle --sourcemap-output main.jsbundle.map --minify false",
          );
          execSync(
            "ios/Pods/hermes-engine/destroot/bin/hermesc -O -emit-binary -output-source-map -out=main.jsbundle.hbc main.jsbundle && rm -f main.jsbundle && mv main.jsbundle.hbc main.jsbundle",
          );
          execSync(
            "mv main.jsbundle.map main.jsbundle.packager.map && node node_modules/react-native/scripts/compose-source-maps.js main.jsbundle.packager.map main.jsbundle.hbc.map -o main.jsbundle.map && node node_modules/@sentry/react-native/scripts/copy-debugid.js main.jsbundle.packager.map main.jsbundle.map && rm -f main.jsbundle.packager.map",
          );
          execSync(
            `npx sentry-cli sourcemaps upload --debug-id-reference main.jsbundle main.jsbundle.map --release ${release} --log-level=info --rewrite`,
            { stdio: "inherit" },
          );
          execSync(
            "rm -rf main.jsbundle main.jsbundle.hbc.map main.jsbundle.map",
          );
        }
        if (EAS_BUILD_PLATFORM === "android") {
          execSync(
            "npx expo export:embed --entry-file node_modules/expo-router/entry.js --platform android --dev false --reset-cache --bundle-output index.android.bundle --sourcemap-output index.android.bundle.packager.map --minify false",
          );
          execSync(
            "node_modules/react-native/sdks/hermesc/osx-bin/hermesc -O -emit-binary -output-source-map -out=index.android.bundle.hbc index.android.bundle && rm -f index.android.bundle && mv index.android.bundle.hbc index.android.bundle",
          );
          execSync(
            "node node_modules/react-native/scripts/compose-source-maps.js index.android.bundle.packager.map index.android.bundle.hbc.map -o index.android.bundle.map && node node_modules/@sentry/react-native/scripts/copy-debugid.js index.android.bundle.packager.map index.android.bundle.map && rm -f index.android.bundle.packager.map",
          );
          execSync(
            `npx sentry-cli sourcemaps upload --debug-id-reference index.android.bundle index.android.bundle.map --release ${release} --log-level=info --rewrite`,
            { stdio: "inherit" },
          );
          execSync(
            "rm -rf main.jsbundle main.jsbundle.hbc.map main.jsbundle.map",
          );
        }

        break;
      }
      default:
        console.log(
          `❓ No command for profile "${EAS_BUILD_PROFILE}", skipping post-build.`,
        );
    }
  } catch (err) {
    console.error("❌ Post-build failed:", err.message);
    process.exit(1);
  }
};

sentrySourceMapGenerateAndUpload();
