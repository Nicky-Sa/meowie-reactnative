import { useFeatureFlag as usePostHogFeatureFlag } from "posthog-react-native";

// Add all feature flags here as a discriminated union to keep things type-safe.
type DetailsLayoutFlag = {
  flag: "details-layout";
  variants: "control" | "test";
};

type FeatureFlags = DetailsLayoutFlag;

type FlagKey = FeatureFlags["flag"];
type VariantFor<F extends FlagKey> = Extract<
  FeatureFlags,
  { flag: F }
>["variants"];

/**
 * Type-safe wrapper around PostHog's useFeatureFlag.
 * Returns the variant key for a given flag, or undefined if not yet loaded / flag is disabled.
 */
export const useFeatureFlag = <F extends FlagKey>(
  flag: F,
): VariantFor<F> | undefined => {
  const variant = usePostHogFeatureFlag(flag);

  // undefined = not yet loaded; false = flag disabled — both fall back to control in the consumer.
  if (typeof variant !== "string") return;

  // Cast is safe: PostHog returns the string variant we defined in the dashboard.
  return variant as VariantFor<F>;
};
