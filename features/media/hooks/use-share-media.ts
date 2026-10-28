import { useCallback } from "react";
import { Share } from "react-native";
import Toast from "react-native-toast-message";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { getShareLink, ShareTrigger } from "@/features/media/data/share-links";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Args = {
  mediaType: MediaType;
  id: ID;
  trigger: ShareTrigger;
};

/** Opens the system share sheet with the link to this movie or series. */
export const useShareMedia = ({ mediaType, id, trigger }: Args) => {
  const { media } = useAnalytics();

  return useCallback(async () => {
    try {
      const result = await Share.share({ url: getShareLink(mediaType, id) });
      if (result.action === Share.sharedAction) {
        media.trackShare({ mediaId: id, mediaType, trigger });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to open sharing" });
      console.error(error);
    }
  }, [media, mediaType, id, trigger]);
};
