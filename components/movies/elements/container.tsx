import { useFetchInfo } from "@/hooks/data/useFetchInfo";
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
import { GoogleIt } from "@/components/movies/elements/google-it";
import { Bento } from "@/components/common/bento";
import { Ratings } from "@/components/movies/elements/ratings";
import { ScrollView } from "react-native-gesture-handler";
import { MoviesErrorState } from "@/components/movies/elements/error-state";
import { useContentScreenSize } from "@/components/movies/hooks";
import { MoviesSkeleton } from "@/components/movies/elements/skeleton";

type Props = {
  id: number;
  shouldPlay: boolean;
  shouldFetch: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const DetailsContainer = memo(
  ({ id, shouldPlay, shouldFetch, index, scrollY }: Props) => {
    const { isLoading, data, error, mutate } = useFetchInfo(id, shouldFetch);
    const randomColor = useMemo(
      () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      [],
    );
    const [, setColor] = useAtom(colorAtom);

    const { height } = useContentScreenSize();

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
          animatedStyle, // Apply animated styles
        ]}
        className={"w-full flex-1 justify-end"}
      >
        {isLoading || !data ? (
          <MoviesSkeleton />
        ) : (
          <View
            className={
              "relative flex w-full flex-col items-start justify-center gap-1.5 xs:gap-3"
            }
            style={{
              height: height * 0.9,
            }}
          >
            <Bento>
              <View className={"flex flex-col gap-1"}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className={"grow-0"}
                >
                  <Text
                    className={
                      "title-t1-strong -mx-4 px-4 text-neutral-10-default"
                    }
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
            </Bento>

            <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />

            <Bento>
              <View className={"flex flex-col gap-2.5"}>
                <Ratings ratings={data.ratings} />
                <View
                  className={
                    "h-[0.7px] w-full rounded-full bg-neutral-12-hover"
                  }
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName={"flex flex-row gap-6"}
                  className={"grow-0"}
                >
                  {data.genres.map((genre) => (
                    <Text
                      key={genre}
                      className={"body-b2-strong text-neutral-5-default"}
                    >
                      {genre}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            </Bento>

            <Bento>
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
            </Bento>

            <Bento>
              <GoogleIt title={data.title} />
            </Bento>
          </View>
        )}
      </Animated.View>
    );
  },
);
DetailsContainer.displayName = "DetailsContainer";
