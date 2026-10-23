export const MEDIA_ACTIONS = ["save"] as const;

export type MediaAction = (typeof MEDIA_ACTIONS)[number];
