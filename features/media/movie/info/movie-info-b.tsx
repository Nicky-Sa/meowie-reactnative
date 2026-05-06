import { useFetchMovieInfo } from "@/features/media/movie/data/useFetchMovieInfo";
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
import { Tourable } from "@/features/common/ui/tour/tourable";
import { TourStep } from "@/features/common/ui/tour/steps";
import { ScrollableGenres } from "@/features/media/components/common/scrollable-genres";
import { ScrollableTitle } from "@/features/media/components/common/scrollable-title";
import { RowInfo } from "@/features/media/components/common/row-info";
import { Actions } from "@/features/media/components/info/elements/actions";

type Props = {
  movieId: ID;
  inScreen: boolean;
  tourEnabled?: boolean;
};

export const MovieInfoB = memo(({ movieId, inScreen, tourEnabled }: Props) => {
  const { data, isLoading, error, refetch } = useFetchMovieInfo(movieId);
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
      media: { id: movieId, type: "movie", title: data.title },
      autoplay,
    });
  }, [autoplay, media, data, movieId]);

  const onPause = useCallback(() => {
    if (!data) return;
    media.trackTrailerPaused({ id: movieId, type: "movie", title: data.title });
  }, [media, data, movieId]);

  const onSavePress = useCallback(
    (saved: boolean | null) => {
      if (!data) return;
      const mediaItem = {
        id: movieId,
        type: "movie" as const,
        title: data.title,
        genres: data.genres.map((g) => g.name),
      };

      if (saved === true) {
        media.trackSave(mediaItem);
      } else if (saved === false) {
        media.trackUnsave(mediaItem);
      }
    },
    [media, data, movieId],
  );

  const onSeenPress = useCallback(() => {
    if (!data) return;
    media.trackSeen({
      id: movieId,
      type: "movie",
      title: data.title,
      genres: data.genres.map((g) => g.name),
    });
  }, [media, data, movieId]);

  const onRate = useCallback(
    (rating: number | null, isFirstTime: boolean) => {
      if (!data) return;
      media.trackRated({
        media: {
          id: movieId,
          type: "movie",
          title: data.title,
          genres: data.genres.map((g) => g.name),
        },
        rating,
        isFirstTime,
      });
    },
    [media, data, movieId],
  );

  const onSkipRating = useCallback(() => {
    if (!data) return;
    media.trackRatingSkipped({
      id: movieId,
      type: "movie",
      title: data.title,
      genres: data.genres.map((g) => g.name),
    });
  }, [media, data, movieId]);

  const onRemoveSeen = useCallback(() => {
    if (!data) return;
    media.trackUnseen({
      id: movieId,
      type: "movie",
      title: data.title,
      genres: data.genres.map((g) => g.name),
    });
  }, [media, data, movieId]);

  const onPosterExpanded = useCallback(() => {
    if (!data) return;
    media.trackExpand({
      mediaId: movieId,
      mediaType: "movie",
      mediaTitle: data.title,
    });
  }, [media, data, movieId]);

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
        info={[data.screeningStatus, data.certification, data.duration]}
      />

      <View className={"flex w-full flex-row gap-2"}>
        <Tourable
          tourEnabled={tourEnabled}
          tour={{
            step: TourStep.MediaPoster,
            shape: "rectangle",
            borderRadius: 12,
          }}
        >
          <EnlargeableImage
            source={data.posterPath}
            blurhash={data.posterProps.blurhash}
            width={60}
            onPress={onPosterExpanded}
          />
        </Tourable>
        <View className={"flex flex-1 flex-col gap-3"}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            className={"body-b2 text-neutral-6-default"}
          >
            {data.overview}
          </Text>
          <Tourable
            tourEnabled={tourEnabled}
            tour={{
              step: TourStep.MediaGenres,
              shape: "rectangle",
              borderRadius: 14,
            }}
          >
            <ScrollableGenres
              genres={data.genres}
              mediaType={"movie"}
              className={"grow-0"}
            />
          </Tourable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-ml-4 grow-0 pl-4"}
        contentContainerClassName={"min-w-full h-7 gap-4 items-center"}
      >
        <Tourable
          tourEnabled={tourEnabled}
          tour={{
            step: TourStep.MediaDirector,
            shape: "rectangle",
            borderRadius: 14,
          }}
        >
          <Credit {...data.credits.director} />
        </Tourable>

        <View className={"h-4 w-[1px] rounded-xl bg-neutral-10-default"} />

        <Credits credits={data.credits.casts.slice(0, 5)} />
      </ScrollView>

      <Actions
        mediaId={movieId}
        mediaType={"movie"}
        tourEnabled
        onSavePress={onSavePress}
        onSeenPress={onSeenPress}
        onRate={onRate}
        onSkipRating={onSkipRating}
        onRemoveSeen={onRemoveSeen}
      />
    </View>
  );
});

MovieInfoB.displayName = "MovieInfoB";
