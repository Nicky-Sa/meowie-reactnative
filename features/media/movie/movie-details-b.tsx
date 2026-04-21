import { useFetchMovieInfo } from "@/features/media/movie/data/useFetchMovieInfo";
// ScrollView imported from react-native to avoid interference with gesture handler (back)
import { View, Text, ScrollView } from "react-native";
import { TrailerPlayer } from "@/features/media/components/details/elements/trailer-player";
import { memo, useCallback } from "react";
import { useAtom } from "jotai";
import { autoplayAtom, colorAtom } from "@/atoms";
import { Ratings } from "@/features/media/components/details/elements/ratings";
import { ErrorState } from "@/features/general/error-state";
import { Genres } from "@/features/media/components/details/elements/genres";
import { Casts } from "@/features/media/components/details/elements/casts";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Cast } from "@/features/media/components/details/elements/cast";
import { MovieDetailsSkeleton } from "@/features/media/components/details/media-details-skeleton";
import { ID } from "@/features/common/data/media-query";
import { Save } from "@/features/media/components/details/elements/save/save";
import { Seen } from "@/features/media/components/details/elements/seen/seen";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useFocusEffect } from "expo-router";
import { Tourable } from "@/features/common/ui/tour/Tourable";
import { TourStep } from "@/features/common/ui/tour/steps";

type Props = {
  movieId: ID;
  inScreen: boolean;
  tourEnabled?: boolean;
};

export const MovieDetailsB = memo(
  ({ movieId, inScreen, tourEnabled }: Props) => {
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
        capture("media_saved", {
          media_type: "movie",
          media_id: movieId,
          media_title: data?.title || "",
          genres: data?.genres.map((genre) => genre.name) || [],
          saved,
        });
      },
      [capture, data?.genres, data?.title, movieId],
    );

    const onSeenPress = useCallback(
      (seen: boolean | null) => {
        capture("media_seen", {
          media_type: "movie",
          media_id: movieId,
          media_title: data?.title || "",
          genres: data?.genres.map((genre) => genre.name) || [],
          seen,
        });
      },
      [capture, data?.genres, data?.title, movieId],
    );

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
      <MovieDetailsSkeleton />
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
          <Ratings ratings={data.ratings} />
        </View>

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

        <View className={"flex w-full flex-row gap-2"}>
          <Tourable
            tour={
              tourEnabled
                ? {
                    step: TourStep.MediaPoster,
                    text: "Click to expand the poster.",
                    shape: "rectangle",
                    borderRadius: 12,
                  }
                : null
            }
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
              tour={
                tourEnabled
                  ? {
                      step: TourStep.MediaGenres,
                      text: "Click on any genre to filter by it.",
                      shape: "rectangle",
                      borderRadius: 14,
                    }
                  : null
              }
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={"grow-0"}
                contentContainerClassName={"min-w-full h-6"} // fixed height in case the array is empty to prevent layout shift
              >
                <Genres genres={data.genres} mediaType="movie" />
              </ScrollView>
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
            tour={
              tourEnabled
                ? {
                    step: TourStep.MediaDirector,
                    text: "Click to see the director's page.",
                    shape: "rectangle",
                    borderRadius: 14,
                  }
                : null
            }
          >
            <Cast {...data.credits.director} />
          </Tourable>

          <View className={"h-4 w-[1px] rounded-xl bg-neutral-10-default"} />

          <Casts casts={data.credits.casts} />
        </ScrollView>

        <View
          className={
            "mt-4 flex w-full flex-row items-center justify-start gap-6"
          }
        >
          <Tourable
            tour={
              tourEnabled
                ? {
                    step: TourStep.MediaSave,
                    text: "Save it for later!",
                    shape: "rectangle",
                    borderRadius: 14,
                  }
                : null
            }
          >
            <Save id={movieId} mediaType="movie" onPress={onSavePress} />
          </Tourable>
          <Seen id={movieId} mediaType="movie" onPress={onSeenPress} />
        </View>
      </View>
    );
  },
);

MovieDetailsB.displayName = "MovieDetailsB";
