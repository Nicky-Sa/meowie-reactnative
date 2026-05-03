import { useFetchMovieInfo } from "@/features/media/movie/data/useFetchMovieInfo";
// ScrollView imported from react-native to avoid interference with gesture handler (back)
import { View, Text, ScrollView } from "react-native";
import { TrailerPlayer } from "@/features/media/components/info/elements/trailer-player";
import { memo, useCallback } from "react";
import { useAtom } from "jotai";
import { autoplayAtom, colorAtom } from "@/atoms";
import { Ratings } from "@/features/media/components/info/elements/ratings";
import { ErrorState } from "@/features/general/error-state";
import { Genres } from "@/features/media/components/info/elements/genres";
import { Credits } from "@/features/media/components/info/elements/credits";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Credit } from "@/features/media/components/info/elements/credit";
import { MediaInfoSkeleton } from "@/features/media/components/info/media-info-skeleton";
import { ID } from "@/features/common/data/media-query";
import { Save } from "@/features/media/components/info/elements/save/save";
import { Seen } from "@/features/media/components/info/elements/seen/seen";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useFocusEffect } from "expo-router";
import { Tourable } from "@/features/common/ui/tour/tourable";
import { TourStep } from "@/features/common/ui/tour/steps";
import { DetailsButton } from "@/features/media/components/details/details-button";

type Props = {
  movieId: ID;
  inScreen: boolean;
  tourEnabled?: boolean;
};

export const MovieInfoA = memo(({ movieId, inScreen, tourEnabled }: Props) => {
  const { data, isLoading, error, refetch } = useFetchMovieInfo(movieId);
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
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
      autoplay,
    });
  }, [autoplay, capture, data?.title, movieId]);

  const onPause = useCallback(() => {
    capture("trailer_paused", {
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, movieId]);

  const onSavePress = useCallback(
    (saved: boolean | null) => {
      if (saved === true) {
        capture("media_save_clicked", {
          media_type: "movie",
          media_id: movieId,
          media_title: data?.title || "",
          genres: data?.genres.map((genre) => genre.name) || [],
        });
      } else if (saved === false) {
        capture("media_unsave_clicked", {
          media_type: "movie",
          media_id: movieId,
          media_title: data?.title || "",
          genres: data?.genres.map((genre) => genre.name) || [],
        });
      }
    },
    [capture, data?.genres, data?.title, movieId],
  );

  const onSeenPress = useCallback(() => {
    capture("media_seen_clicked", {
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
      genres: data?.genres.map((genre) => genre.name) || [],
    });
  }, [capture, data?.genres, data?.title, movieId]);

  const onRate = useCallback(
    (rating: number | null, isFirstTime: boolean) => {
      capture("media_rated", {
        media_type: "movie",
        media_id: movieId,
        media_title: data?.title || "",
        genres: data?.genres.map((genre) => genre.name) || [],
        rating,
        is_first_time_rating: isFirstTime,
      });
    },
    [capture, data?.genres, data?.title, movieId],
  );

  const onSkip = useCallback(() => {
    capture("media_rating_skipped", {
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
      genres: data?.genres.map((genre) => genre.name) || [],
    });
  }, [capture, data?.genres, data?.title, movieId]);

  const onRemoveSeen = useCallback(() => {
    capture("media_unseen_clicked", {
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
      genres: data?.genres.map((genre) => genre.name) || [],
    });
  }, [capture, data?.genres, data?.title, movieId]);

  const onPosterExpanded = useCallback(() => {
    capture("poster_expanded", {
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, movieId]);

  return error ? (
    <ErrorState tryAgain={refetch} error={error} />
  ) : isLoading || !data ? (
    <MediaInfoSkeleton />
  ) : (
    <View className={"flex w-full flex-col gap-4"}>
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
        <View className={"flex flex-1 flex-col gap-2"}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={"-mx-2 grow-0"}
            contentContainerClassName={"min-w-full"}
          >
            <Text className={"title-t1-strong px-2 text-neutral-10-default"}>
              {data.title}
            </Text>
          </ScrollView>
          <View className={"flex flex-row gap-5"}>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.screeningStatus}
            </Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.certification}
            </Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.duration}
            </Text>
          </View>
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

      <Tourable
        tourEnabled={tourEnabled}
        tour={{
          step: TourStep.MediaGenres,
          shape: "rectangle",
          borderRadius: 14,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={"-ml-4 grow-0 pl-4"}
          contentContainerClassName={"min-w-full h-6"} // fixed height in case the array is empty to prevent layout shift
        >
          <Genres genres={data.genres} mediaType="movie" />
        </ScrollView>
      </Tourable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-ml-4 grow-0 pl-4"}
        contentContainerClassName={"min-w-full h-8"}
      >
        <Credits credits={data.credits.casts.slice(0, 5)} />
      </ScrollView>

      <View className={"mt-4 flex flex-row items-center justify-between"}>
        <View className={"flex flex-row items-center justify-start gap-2"}>
          <Tourable
            tourEnabled={tourEnabled}
            tour={{
              step: TourStep.MediaSave,
              shape: "rectangle",
              borderRadius: 14,
            }}
          >
            <Save id={movieId} mediaType="movie" onPress={onSavePress} />
          </Tourable>
          <Tourable
            tourEnabled={tourEnabled}
            tour={{
              step: TourStep.MediaSeen,
              shape: "rectangle",
              borderRadius: 14,
            }}
          >
            <Seen
              id={movieId}
              mediaType="movie"
              onPress={onSeenPress}
              onRate={onRate}
              onSkip={onSkip}
              onRemove={onRemoveSeen}
            />
          </Tourable>
        </View>
        <DetailsButton mediaType="movie" />
      </View>
    </View>
  );
});

MovieInfoA.displayName = "MovieInfoA";
