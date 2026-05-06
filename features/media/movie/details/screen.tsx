import { useLocalSearchParams } from "expo-router";
import { useFetchMovieInfo } from "@/features/media/movie/data/useFetchMovieInfo";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { ErrorState } from "@/features/general/error-state";
import { Hero } from "@/features/media/components/details/elements/hero";
import { Overview } from "@/features/media/components/details/elements/overview";
import { Actions } from "@/features/media/components/details/elements/actions";
import { WatchProviders } from "@/features/media/components/details/elements/watch-providers";
import { Credits } from "@/features/media/components/details/elements/credits";
import { Recommendations } from "@/features/media/components/details/elements/recommendations";
import { useCallback } from "react";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useIsTransitionFinished } from "@/hooks/use-is-transition-finished";
import { Ratings } from "@/features/media/components/info/elements/ratings";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { View } from "react-native";
import { MediaDetailsSkeleton } from "@/features/media/components/details/media-details-skeleton";

export const Screen = () => {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const { data, isLoading, error, refetch } = useFetchMovieInfo(movieId);
  const { media } = useAnalytics();
  const isTransitionFinished = useIsTransitionFinished();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onTrailerPlay = useCallback(() => {
    if (!data) return;
    media.trackTrailerPlayed({
      media: { id: movieId, type: "movie", title: data.title },
      autoplay: false,
    });
  }, [media, data, movieId]);

  const onTrailerPause = useCallback(() => {
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
      ) : isLoading || !data || !isTransitionFinished ? (
        <MediaDetailsSkeleton />
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
