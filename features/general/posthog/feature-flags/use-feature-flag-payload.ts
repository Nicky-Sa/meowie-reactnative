import { useFeatureFlagResult } from "posthog-react-native";
import {
  FeatureFlagPayloads,
  PayloadFlag,
} from "@/features/general/posthog/feature-flags/types";

/** PostHog gives every payload as any JSON, so each flag checks that its payload has the expected type. */
const isFlagPayload: {
  [F in PayloadFlag]: (payload: unknown) => payload is FeatureFlagPayloads[F];
} = {
  "minimum-app-version": (payload): payload is string =>
    typeof payload === "string",
};

/** Returns undefined while flags load, when the flag is off, or when its payload has the wrong type. */
export const useFeatureFlagPayload = <F extends PayloadFlag>(
  flag: F,
): FeatureFlagPayloads[F] | undefined => {
  const payload = useFeatureFlagResult(flag)?.payload;
  if (!isFlagPayload[flag](payload)) return;
  return payload;
};
