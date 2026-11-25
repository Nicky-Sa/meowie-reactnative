export type FeatureFlagPayloads = {
  "minimum-app-version": string;
  "minimum-app-version-preview": string;
};

export type PayloadFlag = keyof FeatureFlagPayloads;
