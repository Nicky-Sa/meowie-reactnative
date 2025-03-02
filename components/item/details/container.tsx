import { MainBg } from "@/components/layout/main-bg";
import { useFetchInfo } from "@/hooks/tmdb/useFetchInfo";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Linking,
} from "react-native";
import { TrailerPlayer } from "@/components/item/details/trailer-player";
import IMDBLogo from "@/assets/icons/ratings/imdb.svg";
import RottenTomatoLogo from "@/assets/icons/ratings/rotten-tomato.svg";
import Google from "@/assets/icons/google.svg";
import { useFetchColor } from "@/hooks/useFetchColor";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Bento from "@/components/common/bento";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";

type Props = {
  id: number;
  shouldPlay: boolean;
  shouldFetch: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const DetailsContainer = memo(
  ({ id, shouldPlay, shouldFetch, index, scrollY }: Props) => {
    const { isLoading, data, error } = useFetchInfo(id, shouldFetch);
    const fetchedColor = useFetchColor(data?.posterPath);
    const [, setColor] = useAtom(colorAtom);

    const { height, width } = useWindowDimensions();

    useEffect(() => {
      if (shouldPlay) setColor(fetchedColor);
    }, [fetchedColor, shouldPlay]);

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

    if (isLoading || !data) {
      return (
        <View
          className={"flex-1 items-center justify-center"}
          style={{
            height,
          }}
        />
      );
    }

    return (
      <Animated.View
        style={[
          {
            height,
          },
          animatedStyle, // Apply animated styles
        ]}
        className={`w-full flex-1 justify-end`}
      >
        <View
          className={
            "flex w-full flex-col items-start justify-center gap-1.5 px-4 xs:gap-3"
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
                className={"-mx-4 flex grow-0"}
              >
                <Text className={"text-title px-4"}>{data.title}</Text>
              </ScrollView>
              <View className={"flex flex-row gap-8"}>
                <Text className={"text-default"}>{data.publishYear}</Text>
                <Text className={"text-default"}>{data.certification}</Text>
                <Text className={"text-default"}>{data.duration}</Text>
              </View>
            </View>
          </Bento>

          <Bento hasPadding={false}>
            <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />
          </Bento>

          <Bento>
            <View className={"flex flex-col gap-2"}>
              <View className={"flex flex-row items-center gap-8"}>
                <View className={"flex flex-row items-center gap-2"}>
                  <IMDBLogo />
                  <Text className={"text-default"}>
                    {data.ratings[0].value}
                  </Text>
                </View>
                <View className={"flex flex-row items-center gap-2"}>
                  <RottenTomatoLogo />
                  <Text className={"text-default"}>
                    {data.ratings[1].value}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={"w-full grow-0 overflow-visible"}
                contentContainerClassName={"flex flex-row gap-6"}
              >
                {data.genres.map((genre, index) => (
                  <Text key={genre} className={"text-label"}>
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
                className={"text-small flex-1 overflow-hidden"}
              >
                {data.overview}
              </Text>
            </View>
          </Bento>
          <Bento>
            <Pressable
              onPress={() => {
                const encodedQuery = encodeURIComponent(data.title);
                const url = `https://www.google.com/search?q=${encodedQuery}`;

                Linking.openURL(url).catch((err) =>
                  console.error("Failed to open URL", err),
                );
              }}
            >
              <Google />
            </Pressable>
          </Bento>
        </View>
      </Animated.View>
    );
  },
);
