import { useCallback, useMemo } from "react";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { Genre } from "@/features/general/data/constants/use-genres";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Args = {
  id: ID;
  mediaType: MediaType;
  /** Undefined while the media is still loading; every handler then does nothing. */
  title: string | undefined;
  genres: Genre[] | undefined;
  autoplay?: boolean;
};

/**
 * The tracking handlers the movie and series screens all need, in one place.
 * Both the feed card and the details screen use the same set.
 */
export const useMediaTracking = ({
  id,
  mediaType,
  title,
  genres,
  autoplay = false,
}: Args) => {
  const { media } = useAnalytics();

  const item = useMemo(
    () =>
      title && genres
        ? {
            id,
            type: mediaType,
            title,
            genres: genres.map((genre) => genre.name),
          }
        : null,
    [id, mediaType, title, genres],
  );

  const onTrailerPlay = useCallback(() => {
    if (!item) return;
    media.trackTrailerPlayed({ media: item, autoplay });
  }, [media, item, autoplay]);

  const onTrailerPause = useCallback(() => {
    if (!item) return;
    media.trackTrailerPaused(item);
  }, [media, item]);

  const onPosterExpanded = useCallback(() => {
    if (!item) return;
    media.trackExpand({
      mediaId: item.id,
      mediaType: item.type,
      mediaTitle: item.title,
    });
  }, [media, item]);

  const onSavePress = useCallback(
    (saved: boolean | null) => {
      if (!item) return;
      if (saved === true) {
        media.trackSave(item);
      } else if (saved === false) {
        media.trackUnsave(item);
      }
    },
    [media, item],
  );

  const onSeenPress = useCallback(() => {
    if (!item) return;
    media.trackSeen(item);
  }, [media, item]);

  const onRate = useCallback(
    (rating: number | null, isFirstTime: boolean) => {
      if (!item) return;
      media.trackRated({ media: item, rating, isFirstTime });
    },
    [media, item],
  );

  const onSkipRating = useCallback(() => {
    if (!item) return;
    media.trackRatingSkipped(item);
  }, [media, item]);

  const onRemoveSeen = useCallback(() => {
    if (!item) return;
    media.trackUnseen(item);
  }, [media, item]);

  return {
    onTrailerPlay,
    onTrailerPause,
    onPosterExpanded,
    onSavePress,
    onSeenPress,
    onRate,
    onSkipRating,
    onRemoveSeen,
  };
};
