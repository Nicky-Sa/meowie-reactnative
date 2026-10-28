import { NativeIntent } from "expo-router";
import { getDefaultStore } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { getSharedMediaFromLink } from "@/features/media/data/share-links";
import { posthog } from "@/features/general/posthog/client";
import { Properties } from "@/features/general/posthog/events";

export const redirectSystemPath: NativeIntent["redirectSystemPath"] = ({
  path,
  initial,
}) => {
  const sharedMedia = getSharedMediaFromLink(path);
  if (!sharedMedia) {
    return path;
  }

  // This runs outside React, so it can't use useAnalytics.
  try {
    posthog.capture("shared_link_opened", {
      media_type: sharedMedia.mediaType,
      media_id: sharedMedia.id,
      is_cold_start: initial,
    } satisfies Properties<"shared_link_opened">);
  } catch (error) {
    console.error("Could not track the shared link:", error);
  }

  // On a cold start, the splash and Home load first, so Back from the details screen has somewhere to go.
  if (initial) {
    getDefaultStore().set(linkToOpenAtom, sharedMedia.detailsPath);
    return "/";
  }

  return sharedMedia.detailsPath;
};
