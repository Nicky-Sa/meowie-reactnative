import { useLocalSearchParams } from "expo-router";
import { useFetchSeriesInfo } from "@/features/media/series/data/useFetchSeriesInfo";
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
import { autoplayAtom } from "@/atoms";
import { useAtom } from "jotai";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Ratings } from "@/features/media/components/info/elements/ratings";
import { View } from "react-native";

export const Screen = () => {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  const { data, isLoading, error, refetch } = useFetchSeriesInfo(seriesId);
  const { capture } = useCaptureEvent();
  const [autoplay] = useAtom(autoplayAtom);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onTrailerPlay = useCallback(() => {
    capture("trailer_played", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
      autoplay,
    });
  }, [autoplay, capture, data?.title, seriesId]);

  const onTrailerPause = useCallback(() => {
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
            year={data.airingYears}
            certification={data.contentRating}
            duration={data.seasonsText}
            genres={data.genres}
            mediaType="series"
            autoplay={autoplay}
            onPlay={onTrailerPlay}
            onPause={onTrailerPause}
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

            <WatchProviders providers={data.watchProviders} />

            <View className={"-mx-4 flex flex-1 flex-col gap-6"}>
              <Credits cast={data.credits.casts} crew={data.credits.crew} />
              <Recommendations
                recommendations={data.recommendations}
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
