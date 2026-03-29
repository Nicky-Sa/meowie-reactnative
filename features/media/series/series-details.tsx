import { useFetchSeriesInfo } from "@/features/media/series/data/useFetchSeriesInfo";
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
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useFocusEffect } from "expo-router";

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesDetails = memo(({ seriesId, inScreen }: Props) => {
  const { data, isLoading, error, mutate } = useFetchSeriesInfo(seriesId);
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
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
      autoplay,
    });
  }, [autoplay, capture, data?.title, seriesId]);

  const onPause = useCallback(() => {
    capture("trailer_paused", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, seriesId]);

  const onSavePress = useCallback(
    (saved: boolean | null) => {
      capture("media_saved", {
        media_type: "series",
        media_id: seriesId,
        media_title: data?.title || "",
        genres: data?.genres.map((genre) => genre.name) || [],
        saved,
      });
    },
    [capture, data?.genres, data?.title, seriesId],
  );

  const onPosterExpanded = useCallback(() => {
    capture("poster_expanded", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, seriesId]);

  return error ? (
    <ErrorState tryAgain={mutate} error={error} />
  ) : isLoading || !data ? (
    <MovieDetailsSkeleton />
  ) : (
    <View className={"flex w-full flex-col gap-4"}>
      <View className={"flex w-full flex-row gap-2"}>
        <EnlargeableImage
          source={data.posterPath}
          blurhash={data.posterProps.blurhash}
          width={60}
          onPress={onPosterExpanded}
        />
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
            <Text className={"body-b2 text-neutral-5-default"}>Series</Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.airingYears}
            </Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.contentRating}
            </Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {`${data.numberOfSeasons} Season${
                data.numberOfSeasons === 1 ? "" : "s"
              }`}
            </Text>
          </View>
          <Cast {...data.credits.creator} />
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0"}
        contentContainerClassName={"min-w-full h-6"} // fixed height in case the array is empty to prevent layout shift
      >
        <Genres genres={data.genres} mediaType="series" />
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0"}
        contentContainerClassName={"min-w-full h-6"}
      >
        <Casts casts={data.credits.casts} />
      </ScrollView>

      <View
        className={"mt-4 flex w-full flex-row items-center justify-start gap-2"}
      >
        <Save id={seriesId} mediaType="series" onPress={onSavePress} />
      </View>
    </View>
  );
});

SeriesDetails.displayName = "SeriesDetails";
