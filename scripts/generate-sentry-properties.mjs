import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
const SENTRY_URL = process.env.SENTRY_URL;

// Validate required variables
if (!SENTRY_ORG || !SENTRY_PROJECT || !SENTRY_AUTH_TOKEN || !SENTRY_URL) {
  throw new Error("❌ Missing required Sentry environment variables.");
}

// Content of sentry.properties
const content = `
defaults.url=${SENTRY_URL}
defaults.org=${SENTRY_ORG}
defaults.project=${SENTRY_PROJECT}

auth.token=${SENTRY_AUTH_TOKEN}
`.trim();

// Determine the build platform: 'android', 'ios', or undefined (local build)
const EAS_BUILD_PLATFORM = process.env.EAS_BUILD_PLATFORM;

const targetPlatforms =
  EAS_BUILD_PLATFORM === "android" || EAS_BUILD_PLATFORM === "ios"
    ? [EAS_BUILD_PLATFORM]
    : ["android", "ios"]; // local build fallback

// Write to target platform directories
targetPlatforms.forEach((platform) => {
  const dirPath = path.join(platform);
  const outputPath = path.join(dirPath, "sentry.properties");

  if (fs.existsSync(dirPath)) {
    fs.writeFileSync(outputPath, content);
    console.log(`✅ sentry.properties written to ${outputPath}`);
  } else {
    throw new Error(
      `⚠️ Skipped writing to ${platform} for path ${outputPath}/ — directory does not exist`,
    );
  }
});
