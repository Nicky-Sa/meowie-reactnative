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
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useFocusEffect } from "expo-router";
import { ScrollableGenres } from "@/features/media/components/common/scrollable-genres";
import { ScrollableTitle } from "@/features/media/components/common/scrollable-title";
import { RowInfo } from "@/features/media/components/common/row-info";
import { Actions } from "@/features/media/components/info/elements/actions";

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesInfoA = memo(({ seriesId, inScreen }: Props) => {
  const { data, isLoading, error, refetch } = useFetchSeriesInfo(seriesId);
  const [, setColor] = useAtom(colorAtom);
  const [autoplay] = useAtom(autoplayAtom);

  const { capture } = useCaptureEvent();

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
    capture("trailer_played", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
      autoplay,
    });
  }, [autoplay, capture, data?.title, seriesId]);

  const onPause = useCallback(() => {
    capture("trailer_paused", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, seriesId]);

  const onSavePress = useCallback(
    (saved: boolean | null) => {
      if (saved === true) {
        capture("media_save_clicked", {
          media_type: "series",
          media_id: seriesId,
          media_title: data?.title || "",
          genres: data?.genres.map((genre) => genre.name) || [],
        });
      } else if (saved === false) {
        capture("media_unsave_clicked", {
          media_type: "series",
          media_id: seriesId,
          media_title: data?.title || "",
          genres: data?.genres.map((genre) => genre.name) || [],
        });
      }
    },
    [capture, data?.genres, data?.title, seriesId],
  );

  const onSeenPress = useCallback(() => {
    capture("media_seen_clicked", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
      genres: data?.genres.map((genre) => genre.name) || [],
    });
  }, [capture, data?.genres, data?.title, seriesId]);

  const onRate = useCallback(
    (rating: number | null, isFirstTime: boolean) => {
      capture("media_rated", {
        media_type: "series",
        media_id: seriesId,
        media_title: data?.title || "",
        genres: data?.genres.map((genre) => genre.name) || [],
        rating,
        is_first_time_rating: isFirstTime,
      });
    },
    [capture, data?.genres, data?.title, seriesId],
  );

  const onSkipRating = useCallback(() => {
    capture("media_rating_skipped", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
      genres: data?.genres.map((genre) => genre.name) || [],
    });
  }, [capture, data?.genres, data?.title, seriesId]);

  const onRemoveSeen = useCallback(() => {
    capture("media_unseen_clicked", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
      genres: data?.genres.map((genre) => genre.name) || [],
    });
  }, [capture, data?.genres, data?.title, seriesId]);

  const onPosterExpanded = useCallback(() => {
    capture("poster_expanded", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, seriesId]);

  return error ? (
    <ErrorState tryAgain={refetch} error={error} />
  ) : isLoading || !data ? (
    <MediaInfoSkeleton />
  ) : (
    <View className={"flex w-full flex-col gap-4"}>
      <View className={"flex w-full flex-row gap-2"}>
        <EnlargeableImage
          source={data.posterPath}
          blurhash={data.posterProps.blurhash}
          width={60}
          onPress={onPosterExpanded}
        />
        <View className={"flex flex-1 flex-col gap-2"}>
          <ScrollableTitle title={data.title} />

          <RowInfo
            info={[
              "Series",
              data.airingYears,
              data.contentRating,
              data.seasonsText,
            ]}
          />

          <Credit {...data.credits.creator} />
        </View>
      </View>

      <TrailerPlayer
        YTKey={data.trailerKey}
        inScreen={inScreen}
        autoplay={autoplay}
        onPlay={onPlay}
        onPause={onPause}
      />

      <Ratings ratings={data.ratings} />

      <Text
        numberOfLines={3}
        ellipsizeMode="tail"
        className={"body-b2 h-[52px] overflow-hidden text-neutral-6-default"}
      >
        {data.overview}
      </Text>

      <ScrollableGenres
        genres={data.genres}
        mediaType={"series"}
        className={"-ml-4 grow-0 pl-4"}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-ml-4 grow-0 pl-4"}
        contentContainerClassName={"min-w-full h-6"}
      >
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

SeriesInfoA.displayName = "SeriesInfoA";
