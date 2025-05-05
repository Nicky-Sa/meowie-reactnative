import { execSync } from "child_process";
import path from "path";

const EAS_BUILD_PROFILE = process.env.EAS_BUILD_PROFILE;
const EAS_BUILD_PLATFORM = process.env.EAS_BUILD_PLATFORM;
const EAS_BUILD_WORKINGDIR = process.env.EAS_BUILD_WORKINGDIR;

// const SENTRY_ORG = process.env.SENTRY_ORG;
// const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
// const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

const androidSourcemapsPath = path.join(
  EAS_BUILD_WORKINGDIR,
  "android/app/build/generated/sourcemaps/react/",
);
const iosSourcemapsPath = path.join(
  EAS_BUILD_WORKINGDIR,
  "ios/build/sourcemaps/",
);

const sourcemapsPath =
  EAS_BUILD_PLATFORM === "android"
    ? androidSourcemapsPath
    : EAS_BUILD_PLATFORM === "ios"
      ? iosSourcemapsPath
      : (() => {
          console.warn(
            `⚠️ Unknown platform "${EAS_BUILD_PLATFORM}", skipping sourcemap path.`,
          );
          return "";
        })();

// const release = `dev-${process.env.EAS_BUILD_ID}`;

console.log(
  `📦 Running post-build for profile: ${EAS_BUILD_PROFILE}, platform: ${EAS_BUILD_PLATFORM}`,
);

try {
  switch (EAS_BUILD_PROFILE) {
    case "ios-simulator":
    case "development":
      execSync(`ls -a`, { stdio: "inherit" });
      execSync(`pwd`, { stdio: "inherit" });
      // For development release, the versioning is not important, so we use the plain 1.0.0 all the time
      execSync(
        `npx sentry-cli sourcemaps upload ${sourcemapsPath} --release 1.0.0 --platform ${EAS_BUILD_PLATFORM} --log-level=info --rewrite`,
        { stdio: "inherit" },
      );
      break;
    default:
      console.log(
        `❓ No command for profile "${EAS_BUILD_PROFILE}", skipping post-build.`,
      );
  }
} catch (err) {
  console.error("❌ Post-build failed:", err.message);
  process.exit(1);
}
