import { useFetchInfo } from "@/components/movies/data/useFetchInfo";
import { View, Text } from "react-native";
import { TrailerPlayer } from "@/components/movies/elements/trailer-player";
import { memo, useEffect } from "react";
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
import { Image } from "expo-image";
import { tailwind } from "@/lib/utils";

type Props = {
  movieId: number;
  shouldPlay: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const DetailsContainer = memo(
  ({ movieId, shouldPlay, index, scrollY }: Props) => {
    const { isLoading, data, error, mutate } = useFetchInfo(movieId);
    const [, setColor] = useAtom(colorAtom);

    const contentStyle = useMovieContentStyle();
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
      console.log({
        scale,
        opacity,
        title: data?.title,
        data,
        scrollY: scrollY.value,
        inputRange,
      });

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
                source={data.posterPath}
                style={{
                  flexBasis: "25%",
                  aspectRatio: 2 / 3,
                  borderRadius: Number(tailwind.theme.borderRadius.lg),
                }}
                contentFit="contain"
                placeholder={{
                  blurhash: data.posterProps.blurhash,
                  width: 100,
                  height: 150,
                }}
                transition={500}
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
