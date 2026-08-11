import { useFetchSeriesInfo } from "@/features/media/series/data/use-fetch-series-info";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { ErrorState } from "@/features/general/error-state";
import { Hero } from "@/features/media/components/details/elements/hero";
import { Overview } from "@/features/media/components/details/elements/overview";
import { Actions } from "@/features/media/components/details/elements/actions";
import { WatchProviders } from "@/features/media/components/details/elements/watch-providers";
import { Credits } from "@/features/media/components/details/elements/credits";
import { Recommendations } from "@/features/media/components/details/elements/recommendations";
import { useMediaTracking } from "@/features/media/hooks/use-media-tracking";
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
  const isTransitionFinished = useIsTransitionFinished();
  const {
    onTrailerPlay,
    onTrailerPause,
    onPosterExpanded,
    onSavePress,
    onSeenPress,
    onRate,
    onSkipRating,
    onRemoveSeen,
  } = useMediaTracking({
    id: seriesId,
    mediaType: "series",
    title: data?.title,
    genres: data?.genres,
  });

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

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
            backdropPath={data.backdropPath}
            year={data.airingYears}
            certification={data.contentRating}
            duration={data.seasonsText}
            genres={data.genres}
            mediaType="series"
            onPlay={onTrailerPlay}
            onPause={onTrailerPause}
            onPosterExpanded={onPosterExpanded}
          />

          <View className={"mt-6 flex flex-1 flex-col gap-6 px-4"}>
            <Ratings ratings={data.ratings} />

            <Overview overview={data.overview} />

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
