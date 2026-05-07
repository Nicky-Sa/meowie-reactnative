import { useFetchSeriesInfo } from "@/features/media/series/data/useFetchSeriesInfo";
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
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Ratings } from "@/features/media/components/info/elements/ratings";
import { View } from "react-native";
import { MediaDetailsSkeleton } from "@/features/media/components/details/media-details-skeleton";

export const Screen = ({ seriesId }: { seriesId: string }) => {
  const { data, isLoading, error, refetch } = useFetchSeriesInfo(seriesId);
  const { media } = useAnalytics();
  const isTransitionFinished = useIsTransitionFinished();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onTrailerPlay = useCallback(() => {
    if (!data) return;
    media.trackTrailerPlayed({
      media: { id: seriesId, type: "series", title: data.title },
      autoplay: false,
    });
  }, [media, data, seriesId]);

  const onTrailerPause = useCallback(() => {
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

  return (
    <InnerScreen
      title={"Series Details"}
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
            year={data.airingYears}
            certification={data.contentRating}
            duration={data.seasonsText}
            genres={data.genres}
            mediaType="series"
            onPlay={onTrailerPlay}
            onPause={onTrailerPause}
          />

          <View className={"mt-6 flex flex-1 flex-col gap-6 px-4"}>
            <Ratings ratings={data.ratings} />

            <Overview
              overview={data.overview}
              mediaId={seriesId}
              mediaType="series"
            />

            <Actions
              id={seriesId}
              mediaType="series"
              onSavePress={onSavePress}
              onSeenPress={onSeenPress}
              onRate={onRate}
              onSkipRating={onSkipRating}
              onRemoveSeen={onRemoveSeen}
            />

            <WatchProviders
              providers={data.watchProviders}
              mediaId={seriesId}
              mediaType="series"
            />

            <View className={"-mx-4 flex flex-1 flex-col gap-6"}>
              <Credits cast={data.credits.casts} crew={data.credits.crew} />
              <Recommendations
                title={data.title}
                mediaId={Number(seriesId)}
                mediaType="series"
              />
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </InnerScreen>
  );
};
