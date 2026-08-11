import { useFetchMovieInfo } from "@/features/media/movie/data/use-fetch-movie-info";
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
import { useMediaTracking } from "@/features/media/hooks/use-media-tracking";
import { Href, useFocusEffect } from "expo-router";
import { Tourable } from "@/features/common/ui/tour/tourable";
import { TourStep } from "@/features/common/ui/tour/steps";
import { ScrollableGenres } from "@/features/media/components/common/scrollable-genres";
import { ScrollableTitle } from "@/features/media/components/common/scrollable-title";
import { RowInfo } from "@/features/media/components/common/row-info";
import { Actions } from "@/features/media/components/info/elements/actions";
import { useTrackMediaTime } from "@/features/media/hooks/use-track-media-time";
import { Link } from "@/features/common/ui/link";

type Props = {
  movieId: ID;
  inScreen: boolean;
  tourEnabled?: boolean;
};

export const MovieInfo = memo(({ movieId, inScreen, tourEnabled }: Props) => {
  useTrackMediaTime({
    mediaId: movieId,
    mediaType: "movie",
    isVisible: inScreen,
  });

  const { data, isLoading, error, refetch } = useFetchMovieInfo(movieId);
  const [, setColor] = useAtom(colorAtom);
  const [autoplay] = useAtom(autoplayAtom);
  const detailsPath: Href = `/movie/${movieId}/details`;

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
    id: movieId,
    mediaType: "movie",
    title: data?.title,
    genres: data?.genres,
    autoplay,
  });

  useFocusEffect(
    useCallback(() => {
      if (inScreen) {
        if (data?.posterProps.primaryColorHex) {
          setColor(data.posterProps.primaryColorHex);
        }
      }
    }, [data?.posterProps.primaryColorHex, inScreen, setColor]),
  );

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
        onPlay={onTrailerPlay}
        onPause={onTrailerPause}
        backdropPath={data.backdropPath}
      />

      <View className={"flex flex-col gap-2"}>
        <ScrollableTitle title={data.title} href={detailsPath} />
        <Ratings ratings={data.ratings} />
      </View>

      <RowInfo
        info={[data.screeningStatus, data.certification, data.duration]}
      />

      <View className={"flex w-full flex-row gap-2"}>
        <Tourable tourEnabled={tourEnabled} step={TourStep.MediaPoster}>
          <EnlargeableImage
            source={data.posterPath}
            blurhash={data.posterProps.blurhash}
            width={60}
            onPress={onPosterExpanded}
          />
        </Tourable>
        <View className={"flex flex-1 flex-col gap-3"}>
          <Link href={detailsPath}>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              className={"body-b2 text-neutral-6-default"}
            >
              {data.overview}
            </Text>
          </Link>

          <Tourable tourEnabled={tourEnabled} step={TourStep.MediaGenres} fill>
            <ScrollableGenres
              genres={data.genres}
              mediaType={"movie"}
              className={"-mr-4 grow-0 pr-4"}
            />
          </Tourable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0 px-4"}
        contentContainerClassName={"min-w-full h-7 gap-4 items-center"}
      >
        <Tourable tourEnabled={tourEnabled} step={TourStep.MediaDirector}>
          <Credit {...data.credits.director} />
        </Tourable>

        <View className={"h-4 w-[1px] rounded-xl bg-neutral-10-default"} />

        <Credits credits={data.credits.casts.slice(0, 5)} />
      </ScrollView>

      <Actions
        mediaId={movieId}
        mediaType={"movie"}
        tourEnabled={tourEnabled}
        onSavePress={onSavePress}
        onSeenPress={onSeenPress}
        onRate={onRate}
        onSkipRating={onSkipRating}
        onRemoveSeen={onRemoveSeen}
      />
    </View>
  );
});

MovieInfo.displayName = "MovieInfo";
