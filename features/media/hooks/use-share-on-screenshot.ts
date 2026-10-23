import { useCallback } from "react";
import { Platform } from "react-native";
import { useFocusEffect } from "expo-router";
import { addScreenshotListener } from "expo-screen-capture";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { useShareMedia } from "@/features/media/hooks/use-share-media";

// Android 13 and lower needs the READ_MEDIA_IMAGES permission to detect screenshots, which we don't ask for.
const canDetectScreenshots =
  Platform.OS !== "android" || Platform.Version >= 34;

type Args = {
  mediaType: MediaType;
  id: ID;
  /** The feed keeps cards mounted either side of the one you see, so only the visible one should listen. */
  isVisible: boolean;
};

/** Opens the share sheet for this media when the user takes a screenshot. */
export const useShareOnScreenshot = ({ mediaType, id, isVisible }: Args) => {
  const shareMedia = useShareMedia({ mediaType, id });

  useFocusEffect(
    useCallback(() => {
      if (!canDetectScreenshots || !isVisible) {
        return;
      }
      const subscription = addScreenshotListener(shareMedia);
      return () => subscription.remove();
    }, [isVisible, shareMedia]),
  );
};
