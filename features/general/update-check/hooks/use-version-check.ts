import * as Application from "expo-application";
import { useFeatureFlagPayload } from "@/features/general/posthog/feature-flags/use-feature-flag-payload";
import { useFetchLatestVersionNumber } from "@/features/general/update-check/data/use-fetch-latest-version-number";
import { getUpdateState } from "@/features/general/update-check/utils/versions";
import { env } from "@/lib/env";

// Preview and development read their own flag, because all builds share one PostHog project
const getMinimumVersionFlag = () => {
  switch (env.EXPO_PUBLIC_APP_VARIANT) {
    case "production":
      return "minimum-app-version";
    case "preview":
    case "development":
      return "minimum-app-version-preview";
  }
};

export const useVersionCheck = () => {
  const minimumVersion = useFeatureFlagPayload(getMinimumVersionFlag());
  const { data: latestVersion } = useFetchLatestVersionNumber();
  const appVersion = Application.nativeApplicationVersion;

  const updateState = appVersion
    ? getUpdateState(appVersion, minimumVersion, latestVersion)
    : "none";

  return { updateState, latestVersion };
};
