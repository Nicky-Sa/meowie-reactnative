import * as Application from "expo-application";
import { useFeatureFlagPayload } from "@/features/general/posthog/feature-flags/use-feature-flag-payload";
import { useFetchLatestVersionNumber } from "@/features/general/update-check/data/use-fetch-latest-version-number";
import { getUpdateState } from "@/features/general/update-check/utils/versions";

export const useVersionCheck = () => {
  const minimumVersion = useFeatureFlagPayload("minimum-app-version");
  const { data: latestVersion } = useFetchLatestVersionNumber();
  const appVersion = Application.nativeApplicationVersion;

  const updateState = appVersion
    ? getUpdateState(appVersion, minimumVersion, latestVersion)
    : "none";

  return { updateState, latestVersion };
};
