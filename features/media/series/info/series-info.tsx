import { useFetchSeriesInfo } from "@/features/media/series/data/useFetchSeriesInfo";
// ScrollView imported from react-native to avoid interference with gesture handler (back)
import { View, Text, ScrollView } from "react-native";
import { TrailerPlayer } from "@/features/media/components/common/trailer-player";
import { memo, useCallback } from "react";
import { useAtom } from "jotai";
import { autoplayAtom, colorAtom } from "@/atoms";
import { Ratings } from "@/features/media/components/info/elements/ratings";
import { ErrorState } from "@/features/general/error-state";
import { Credits } from "@/features/media/components/info/elements/credits";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Credit } from "@/features/media/components/info/elements/credit";
import { MediaInfoSkeleton } from "@/features/media/components/info/media-info-skeleton";
import { ID } from "@/features/common/data/media-query";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useFocusEffect } from "expo-router";
import { ScrollableGenres } from "@/features/media/components/common/scrollable-genres";
import { ScrollableTitle } from "@/features/media/components/common/scrollable-title";
import { RowInfo } from "@/features/media/components/common/row-info";
import { Actions } from "@/features/media/components/info/elements/actions";
import { useTrackTimeSpent } from "@/features/general/posthog/hook/use-track-time-spent";

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesInfo = memo(({ seriesId, inScreen }: Props) => {
  // Track time spent on this screen
  useTrackTimeSpent(seriesId, "series");

  const { data, isLoading, error, refetch } = useFetchSeriesInfo(seriesId);
  const [, setColor] = useAtom(colorAtom);
  const [autoplay] = useAtom(autoplayAtom);

  const { media } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (inScreen) {
        if (data?.posterProps.primaryColorHex) {
          setColor(data.posterProps.primaryColorHex);
        }
      }
    }, [data?.posterProps.primaryColorHex, inScreen, setColor]),
  );

  // Posthog Events:
  const onPlay = useCallback(() => {
    if (!data) return;
    media.trackTrailerPlayed({
      media: { id: seriesId, type: "series", title: data.title },
      autoplay,
    });
  }, [autoplay, media, data, seriesId]);

  const onPause = useCallback(() => {
    if (!data) return;
    media.trackTrailerPaused({
      id: seriesId,
      type: "series",
      title: data.title,
    });
  }, [media, data, seriesId]);

  const onSavePress = useCallback(
    (saved: boolean | null) => {
      if (!data) return;
      const mediaItem = {
        id: seriesId,
        type: "series" as const,
        title: data.title,
        genres: data.genres.map((g) => g.name),
      };

      if (saved === true) {
        media.trackSave(mediaItem);
      } else if (saved === false) {
        media.trackUnsave(mediaItem);
      }
    },
    [media, data, seriesId],
  );

  const onSeenPress = useCallback(() => {
    if (!data) return;
    media.trackSeen({
      id: seriesId,
      type: "series",
      title: data.title,
      genres: data.genres.map((g) => g.name),
    });
  }, [media, data, seriesId]);

  const onRate = useCallback(
    (rating: number | null, isFirstTime: boolean) => {
      if (!data) return;
      media.trackRated({
        media: {
          id: seriesId,
          type: "series",
          title: data.title,
          genres: data.genres.map((g) => g.name),
        },
        rating,
        isFirstTime,
      });
    },
    [media, data, seriesId],
  );

  const onSkipRating = useCallback(() => {
    if (!data) return;
    media.trackRatingSkipped({
      id: seriesId,
      type: "series",
      title: data.title,
      genres: data.genres.map((g) => g.name),
    });
  }, [media, data, seriesId]);

  const onRemoveSeen = useCallback(() => {
    if (!data) return;
    media.trackUnseen({
      id: seriesId,
      type: "series",
      title: data.title,
      genres: data.genres.map((g) => g.name),
    });
  }, [media, data, seriesId]);

  const onPosterExpanded = useCallback(() => {
    if (!data) return;
    media.trackExpand({
      mediaId: seriesId,
      mediaType: "series",
      mediaTitle: data.title,
    });
  }, [media, data, seriesId]);

  return error ? (
    <ErrorState tryAgain={refetch} error={error} />
  ) : isLoading || !data ? (
    <MediaInfoSkeleton />
  ) : (
    <View className={"flex w-full flex-col gap-4"}>
      <TrailerPlayer
        YTKey={data.trailerKey}
        inScreen={inScreen}
        autoplay={autoplay}
        onPlay={onPlay}
        onPause={onPause}
      />

      <View className={"flex flex-col gap-2"}>
        <ScrollableTitle title={data.title} />
        <Ratings ratings={data.ratings} />
      </View>

      <RowInfo
        info={[
          "Series",
          data.airingYears,
          data.contentRating,
          data.seasonsText,
        ]}
      />

      <View className={"flex w-full flex-row gap-2"}>
        <EnlargeableImage
          source={data.posterPath}
          blurhash={data.posterProps.blurhash}
          width={60}
          onPress={onPosterExpanded}
        />
        <View className={"flex flex-1 flex-col gap-3"}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            className={"body-b2 text-neutral-6-default"}
          >
            {data.overview}
          </Text>

          <ScrollableGenres
            genres={data.genres}
            mediaType={"series"}
            className={"-mr-4 grow-0 pr-4"}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0 px-4"}
        contentContainerClassName={"min-w-full h-7 gap-4 items-center"}
      >
        <Credit {...data.credits.creator} />

        <View className={"h-4 w-[1px] rounded-xl bg-neutral-10-default"} />

        <Credits credits={data.credits.casts.slice(0, 5)} />
      </ScrollView>

      <Actions
        mediaId={seriesId}
        mediaType={"series"}
        onSavePress={onSavePress}
        onSeenPress={onSeenPress}
        onRate={onRate}
        onSkipRating={onSkipRating}
        onRemoveSeen={onRemoveSeen}
      />
    </View>
  );
});

SeriesInfo.displayName = "SeriesInfo";
