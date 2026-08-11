import { useCallback } from "react";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { useTimeOnScreen } from "@/features/common/hooks/use-time-on-screen";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Args = {
  mediaId: ID;
  mediaType: MediaType;
  /** The feed keeps cards mounted either side of the one you see, so only the visible one counts. */
  isVisible: boolean;
};

/** Sends "media_card_time_spent" with how long this movie or tv card was on screen. */
export const useTrackMediaTime = ({ mediaId, mediaType, isVisible }: Args) => {
  const { media } = useAnalytics();

  const onLeave = useCallback(
    (durationMs: number) =>
      media.trackTimeOnCard({
        mediaId,
        mediaType,
        timeOnCardSeconds: Math.round(durationMs / 1000),
      }),
    [media, mediaId, mediaType],
  );

  useTimeOnScreen({
    resetKey: `${mediaType}-${mediaId}`,
    isVisible,
    onLeave,
  });
};
