import { useFetchSeriesInfo } from "@/features/media/series/data/useFetchSeriesInfo";
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

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesDetailsB = memo(({ seriesId, inScreen }: Props) => {
  const { data, isLoading, error, refetch } = useFetchSeriesInfo(seriesId);
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

  const onSkip = useCallback(() => {
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

  const onPosterExpanded = useCallback(() => {
    capture("poster_expanded", {
      media_type: "series",
      media_id: seriesId,
      media_title: data?.title || "",
    });
  }, [capture, data?.title, seriesId]);

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

      <View className={"flex w-full flex-row gap-2"}>
        <EnlargeableImage
          source={data.posterPath}
          blurhash={data.posterProps.blurhash}
          width={60}
          onPress={onPosterExpanded}
        />
        <View className={"flex flex-1 flex-col gap-3"}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            className={"body-b2 text-neutral-6-default"}
          >
            {data.overview}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={"grow-0"}
            contentContainerClassName={"min-w-full h-6"} // fixed height in case the array is empty to prevent layout shift
          >
            <Genres genres={data.genres} mediaType="movie" />
          </ScrollView>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-ml-4 grow-0 pl-4"}
        contentContainerClassName={"min-w-full h-7 gap-4 items-center"}
      >
        <Credit {...data.credits.creator} />

        <View className={"h-4 w-[1px] rounded-xl bg-neutral-10-default"} />

        <Credits credits={data.credits.casts.slice(0, 5)} />
      </ScrollView>

      <View
        className={"mt-4 flex w-full flex-row items-center justify-start gap-6"}
      >
        <Save id={seriesId} mediaType="series" onPress={onSavePress} />
        <Seen
          id={seriesId}
          mediaType="series"
          onPress={onSeenPress}
          onRate={onRate}
          onSkip={onSkip}
          onRemove={onRemoveSeen}
        />
      </View>
    </View>
  );
});

SeriesDetailsB.displayName = "SeriesDetailsB";
