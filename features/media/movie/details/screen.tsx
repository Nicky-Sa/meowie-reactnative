import { useLocalSearchParams } from "expo-router";
import { useFetchMovieInfo } from "@/features/media/movie/data/useFetchMovieInfo";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { MediaInfoSkeleton } from "@/features/media/components/info/media-info-skeleton";
import { ErrorState } from "@/features/general/error-state";
import { Hero } from "@/features/media/components/details/elements/hero";
import { Overview } from "@/features/media/components/details/elements/overview";
import { Actions } from "@/features/media/components/details/elements/actions";
import { WatchProviders } from "@/features/media/components/details/elements/watch-providers";
import { Credits } from "@/features/media/components/details/elements/credits";
import { Recommendations } from "@/features/media/components/details/elements/recommendations";
import { useCallback } from "react";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { View } from "react-native";
import { Ratings } from "@/features/media/components/info/elements/ratings";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const Screen = () => {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const { data, isLoading, error, refetch } = useFetchMovieInfo(movieId);
  const { capture } = useCaptureEvent();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onTrailerPlay = useCallback(() => {
    capture("trailer_played", {
      media_type: "movie",
      media_id: movieId,
      media_title: data?.title || "",
      autoplay: false,
    });
  }, [capture, data?.title, movieId]);

  const onTrailerPause = useCallback(() => {
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

  const onSkipRating = useCallback(() => {
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

  return (
    <InnerScreen
      title={"Movie Details"}
      scrolledTitle={data?.title}
      titleFadeRange={[170, 230]}
      fullWidth
      fullHeight
      scrollY={scrollY}
    >
      {error ? (
        <ErrorState tryAgain={refetch} error={error} />
      ) : isLoading || !data ? (
        <MediaInfoSkeleton />
      ) : (
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <Hero
            title={data.title}
            trailerKey={data.trailerKey}
            posterPath={data.posterPath}
            posterProps={data.posterProps}
            year={data.screeningStatus}
            certification={data.certification}
            duration={data.duration}
            genres={data.genres}
            mediaType="movie"
            onPlay={onTrailerPlay}
            onPause={onTrailerPause}
          />

          <View className={"mt-6 flex flex-1 flex-col gap-6 px-4"}>
            <Ratings ratings={data.ratings} />

            <Overview overview={data.overview} />

            <Actions
              id={movieId}
              mediaType="movie"
              onSavePress={onSavePress}
              onSeenPress={onSeenPress}
              onRate={onRate}
              onSkipRating={onSkipRating}
              onRemoveSeen={onRemoveSeen}
            />

            <WatchProviders providers={data.watchProviders} />

            <View className={"-mx-4 flex flex-1 flex-col gap-6"}>
              <Credits cast={data.credits.casts} crew={data.credits.crew} />
              <Recommendations mediaId={Number(movieId)} mediaType="movie" />
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </InnerScreen>
  );
};
