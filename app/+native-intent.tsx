import { NativeIntent } from "expo-router";
import { getDefaultStore } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { getSharedMediaFromLink } from "@/features/media/data/share-links";
import { posthog } from "@/features/general/posthog/client";
import { Properties } from "@/features/general/posthog/events/types";
import { isAppPath } from "@/lib/utils/query";

// The scheme part of an app link like `meowie://settings`. Website links only open the app for shared media.
const APP_LINK_SCHEME = /^[a-z][a-z0-9+.-]*:\/\/+/i;

export const redirectSystemPath: NativeIntent["redirectSystemPath"] = ({
  path,
  initial,
}) => {
  const sharedMedia = getSharedMediaFromLink(path);
  if (sharedMedia) {
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
  }

  const screenPath =
    sharedMedia?.detailsPath ?? path.replace(APP_LINK_SCHEME, "/");
  // The dev build starts through its launcher's own link, which isn't one of our screens.
  const isDevLauncherLink = screenPath.startsWith("/expo-development-client");

  // On a cold start, the splash loads the fonts and checks onboarding first,
  // and Home loads under the link, so Back has somewhere to go.
  if (
    initial &&
    isAppPath(screenPath) &&
    screenPath !== "/" &&
    !isDevLauncherLink
  ) {
    getDefaultStore().set(linkToOpenAtom, screenPath);
    return "/";
  }

  return sharedMedia?.detailsPath ?? path;
};
