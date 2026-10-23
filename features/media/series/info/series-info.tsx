import { useFetchSeriesDetails } from "@/features/media/series/data/use-fetch-series-details";
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
import { ScrollableGenres } from "@/features/media/components/common/scrollable-genres";
import { ScrollableTitle } from "@/features/media/components/common/scrollable-title";
import { RowInfo } from "@/features/media/components/common/row-info";
import { Actions } from "@/features/media/components/info/elements/actions";
import { useTrackMediaTime } from "@/features/media/hooks/use-track-media-time";
import { useShareOnScreenshot } from "@/features/media/hooks/use-share-on-screenshot";
import { Link } from "@/features/common/ui/link";

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesInfo = memo(({ seriesId, inScreen }: Props) => {
  useTrackMediaTime({
    mediaId: seriesId,
    mediaType: "series",
    isVisible: inScreen,
  });

  const { data, isLoading, error, refetch } = useFetchSeriesDetails(seriesId);
  const [, setColor] = useAtom(colorAtom);
  const [autoplay] = useAtom(autoplayAtom);
  const detailsPath: Href = `/series/${seriesId}/details`;

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
    autoplay,
  });

  useShareOnScreenshot({
    mediaType: "series",
    id: seriesId,
    isVisible: inScreen,
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
        info={[
          "Series",
          data.airingYears,
          data.contentRating,
          data.seasonsText,
        ]}
      />

      <View className={"flex w-full flex-row gap-2"}>
        <EnlargeableImage
          source={data.posterPath}
          blurhash={data.posterProps.blurhash}
          width={60}
          onPress={onPosterExpanded}
        />
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

          <ScrollableGenres
            genres={data.genres}
            mediaType={"series"}
            className={"-mr-4 grow-0 pr-4"}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0 px-4"}
        contentContainerClassName={"min-w-full h-7 gap-4 items-center"}
      >
        <Credit {...data.credits.creator} />

        <View className={"h-4 w-[1px] rounded-xl bg-neutral-10-default"} />

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

SeriesInfo.displayName = "SeriesInfo";
