import { useFetchMovieInfo } from "@/features/movies/movies-info/data/useFetchMovieInfo";
import { View, Text } from "react-native";
import { TrailerPlayer } from "@/features/movies/elements/trailer-player";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import { Ratings } from "@/features/movies/elements/ratings";
import { ScrollView } from "react-native-gesture-handler";
import { ErrorState } from "@/features/general/error-state";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { Genres } from "@/features/movies/elements/genres";
import { Casts } from "@/features/movies/elements/casts";
import { Button } from "@/features/common/button";
import { Heart, Eye, Bookmark, Play } from "iconoir-react-native";
import { Icon } from "@/features/common/icon";
import { EnlargeableImage } from "@/features/general/enlargeable-image";
import { Cast } from "@/features/movies/elements/cast";
import { SkeletonItem } from "@/features/common/skeleton-item";

type Props = {
  movieId: number;
  shouldPlay: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const MovieDetails = memo(
  ({ movieId, shouldPlay, index, scrollY }: Props) => {
    const { data, isLoading, error, mutate } = useFetchMovieInfo(movieId);
    const [, setColor] = useAtom(colorAtom);

    const contentStyle = useMainScreenContentStyle();
    const { height } = contentStyle;

    useEffect(() => {
      if (shouldPlay && data?.posterProps.primaryColorHex)
        setColor(data.posterProps.primaryColorHex);
    }, [data?.posterProps, setColor, shouldPlay]);

    // Animated styles for scaling and opacity
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * height,
        index * height,
        (index + 1) * height,
      ];

      const scale = interpolate(
        scrollY.value,
        inputRange,
        [1.2, 1, 0.8], // Scale down as you scroll away
      );

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        [0.1, 1, 0.1], // Fade out as you scroll away
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });
    return (
      <Animated.View
        style={[animatedStyle]}
        className={"h-full w-full flex-1 justify-start"}
      >
        <View
          className={"flex flex-col items-center justify-start gap-4 px-4"}
          style={contentStyle}
        >
          {isLoading || !data ? (
            <MovieDetailsSkeleton />
          ) : error ? (
            <ErrorState tryAgain={mutate} error={error} />
          ) : (
            <>
              <View
                className={
                  "flex w-full flex-row items-stretch justify-start gap-2"
                }
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
                    <Text
                      className={"title-t1-strong px-2 text-neutral-10-default"}
                    >
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
                  <View
                    className={
                      "flex flex-row items-center justify-center gap-2"
                    }
                  >
                    <Icon i={Play} />

                    <Text className={"body-b1-strong text-neutral-10-default"}>
                      Watch
                    </Text>
                  </View>
                </Button>
              </View>
            </>
          )}
        </View>
      </Animated.View>
    );
  },
);
MovieDetails.displayName = "MovieDetails";

const MovieDetailsSkeleton = () => {
  return (
    <View
      className={
        "flex w-full flex-1 flex-col items-center justify-center gap-4"
      }
    >
      <SkeletonItem className={"h-20"} />
      <SkeletonItem className={"h-48"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-16"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-16"} />
    </View>
  );
};
