import { useFetchMovieInfo } from "@/features/movies/data/useFetchMovieInfo";
import { View, Text } from "react-native";
import { TrailerPlayer } from "@/features/common/movies-list/details/elements/trailer-player";
import { memo, useEffect } from "react";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import { Ratings } from "@/features/common/movies-list/details/elements/ratings";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorState } from "@/features/general/error-state";
import { Genres } from "@/features/common/movies-list/details/elements/genres";
import { Casts } from "@/features/common/movies-list/details/elements/casts";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Cast } from "@/features/common/movies-list/details/elements/cast";
import { MovieDetailsSkeleton } from "@/features/common/movies-list/details/movie-details-skeleton";
import { ID } from "@/features/common/data/query";
import { Bookmark } from "@/features/common/movies-list/details/elements/bookmark/bookmark";

type Props = {
  movieId: ID;
  inScreen: boolean;
};

export const MovieDetails = memo(({ movieId, inScreen }: Props) => {
  const { data, isLoading, error, mutate } = useFetchMovieInfo(movieId);
  const [, setColor] = useAtom(colorAtom);

  useEffect(() => {
    if (inScreen && data?.posterProps.primaryColorHex)
      setColor(data.posterProps.primaryColorHex);
  }, [data?.posterProps, setColor, inScreen]);

  return isLoading || !data ? (
    <MovieDetailsSkeleton />
  ) : error ? (
    <ErrorState tryAgain={mutate} error={error} />
  ) : (
    <View className={"flex w-full flex-col items-center justify-start gap-4"}>
      <View
        className={"flex w-full flex-row items-stretch justify-start gap-2"}
      >
        <EnlargeableImage
          source={data.posterPath}
          blurhash={data.posterProps.blurhash}
          width={60}
        />
        <View className={"flex flex-1 flex-col justify-center gap-2"}>
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
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.publishYear}
            </Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.certification}
            </Text>
            <Text className={"body-b2 text-neutral-5-default"}>
              {data.duration}
            </Text>
          </View>
          <Cast
            id={data.credits.director.id}
            name={data.credits.director.name}
            profilePath={data.credits.director.profilePath}
            character={data.credits.director.character}
          />
        </View>
      </View>

      <TrailerPlayer YTKey={data.trailerKey} inScreen={inScreen} />

      <Ratings ratings={data.ratings} />

      <Text
        numberOfLines={4}
        ellipsizeMode="tail"
        className={"body-b2 overflow-hidden text-neutral-6-default"}
      >
        {data.overview}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0"}
        contentContainerClassName={"min-w-full"}
      >
        <Genres genres={data.genres} />
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className={"-mx-4 grow-0"}
        contentContainerClassName={"min-w-full"}
      >
        <Casts casts={data.credits.casts} />
      </ScrollView>

      <View
        className={"mt-2 flex w-full flex-row items-center justify-start gap-2"}
      >
        <Bookmark id={movieId} />
      </View>
    </View>
  );
});

MovieDetails.displayName = "MovieDetails";
