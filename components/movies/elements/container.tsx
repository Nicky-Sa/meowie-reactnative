import { useFetchInfo } from "@/components/movies/data/useFetchInfo";
import { View, Text, Image } from "react-native";
import { TrailerPlayer } from "@/components/movies/elements/trailer-player";
import { memo, useEffect, useMemo } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import { GoogleMore } from "@/components/movies/elements/google-more";
import { Ratings } from "@/components/movies/elements/ratings";
import { ScrollView } from "react-native-gesture-handler";
import { MoviesErrorState } from "@/components/movies/elements/error-state";
import { useMovieContentStyle } from "@/components/movies/hooks";
import { MoviesSkeleton } from "@/components/movies/elements/skeleton";
import { Genres } from "@/components/movies/elements/genres";

type Props = {
  movieId: number;
  shouldPlay: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const DetailsContainer = memo(
  ({ movieId, shouldPlay, index, scrollY }: Props) => {
    const { isLoading, data, error, mutate } = useFetchInfo(movieId);
    const randomColor = useMemo(
      () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      [],
    );
    const [, setColor] = useAtom(colorAtom);

    const contentStyle = useMovieContentStyle();
    const { height } = contentStyle;

    useEffect(() => {
      if (shouldPlay) setColor(randomColor);
    }, [randomColor, setColor, shouldPlay]);

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

    if (error) {
      return <MoviesErrorState tryAgain={mutate} />;
    }

    return (
      <Animated.View
        style={[
          {
            height,
          },
          animatedStyle,
        ]}
        className={"w-full flex-1 justify-end"}
      >
        {isLoading || !data ? (
          <MoviesSkeleton />
        ) : (
          <View
            className={
              "relative mx-4 flex flex-col items-start justify-center gap-4"
            }
            style={contentStyle}
          >
            <View className={"flex flex-col gap-1"}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={"-mx-4 grow-0"}
                contentContainerClassName={"min-w-full"}
              >
                <Text
                  className={"title-t1-strong px-4 text-neutral-10-default"}
                >
                  {data.title}
                </Text>
              </ScrollView>
              <View className={"flex flex-row gap-8"}>
                <Text className={"body-b1 text-neutral-5-default"}>
                  {data.publishYear}
                </Text>
                <Text className={"body-b1 text-neutral-5-default"}>
                  {data.certification}
                </Text>
                <Text className={"body-b1 text-neutral-5-default"}>
                  {data.duration}
                </Text>
              </View>
            </View>

            <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />

            <Ratings ratings={data.ratings} />

            <View className={"flex flex-row justify-start gap-4"}>
              <Image
                src={data.posterPath}
                className={"basis-[25%] rounded-lg"}
                style={{
                  aspectRatio: 2 / 3,
                }}
                resizeMode={"contain"}
              />
              <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                className={
                  "body-b2 flex-1 overflow-hidden text-neutral-10-default"
                }
              >
                {data.overview}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className={"-mx-4 grow-0"}
              contentContainerClassName={"min-w-full"}
            >
              <Genres genres={data.genres} />
            </ScrollView>

            <GoogleMore title={data.title} />
          </View>
        )}
      </Animated.View>
    );
  },
);
DetailsContainer.displayName = "DetailsContainer";
