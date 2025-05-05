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
        const bundleOutput =
          EAS_BUILD_PLATFORM === "ios"
            ? "main.jsbundle"
            : "index.android.bundle";
        const mapOutput = `${bundleOutput}.map`;

        console.log("🚀 Uploading source maps to Sentry...");
        execSync(
          `npx sentry-cli sourcemaps upload --debug-id-reference ${bundleOutput} ${mapOutput} --release ${release} --log-level=info --rewrite`,
          { stdio: "inherit" },
        );

        console.log("🧹 Cleaning up...");
        execSync(`rm -f ${bundleOutput} ${mapOutput}`, { stdio: "inherit" });

        console.log("✅ Sentry sourcemap upload complete.");
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
