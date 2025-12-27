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
import { Button } from "@/features/common/ui/button";
import { Heart, Eye, Bookmark, Play } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Cast } from "@/features/common/movies-list/details/elements/cast";
import { MovieDetailsSkeleton } from "@/features/common/movies-list/details/movie-details-skeleton";
import { ID } from "@/features/common/data/query";

type Props = {
  movieId: ID;
  shouldPlay: boolean;
};

export const MovieDetails = memo(({ movieId, shouldPlay }: Props) => {
  const { data, isLoading, error, mutate } = useFetchMovieInfo(movieId);
  const [, setColor] = useAtom(colorAtom);

  useEffect(() => {
    if (shouldPlay && data?.posterProps.primaryColorHex)
      setColor(data.posterProps.primaryColorHex);
  }, [data?.posterProps, setColor, shouldPlay]);

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

      <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />

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

      <View className={"mt-4 flex w-full flex-row items-center gap-2"}>
        <Button variant={"ghost"} size={"md"} iconOnly>
          <Icon i={Heart} />
        </Button>
        <Button variant={"ghost"} size={"md"} iconOnly>
          <Icon i={Eye} />
        </Button>
        <Button variant={"ghost"} size={"md"} iconOnly>
          <Icon i={Bookmark} />
        </Button>
        <Button
          variant={"primary"}
          size={"md"}
          iconPosition={"left"}
          className={"flex-1"}
        >
          <View className={"flex flex-row items-center justify-center gap-2"}>
            <Icon i={Play} />

            <Text className={"body-b1-strong text-neutral-10-default"}>
              Watch
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
});

MovieDetails.displayName = "MovieDetails";
