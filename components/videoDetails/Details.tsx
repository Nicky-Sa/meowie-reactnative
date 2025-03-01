import { MainBg } from "@/components/ui/MainBg";
import { useFetchInfo } from "@/hooks/TMDB/useFetchInfo";
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { TrailerPlayer } from "@/components/videoDetails/TrailerPlayer";
import IMDBLogo from "@/assets/images/ratings/IMDB.svg";
import RottenTomatoLogo from "@/assets/images/ratings/RottenTomato.svg";
import Google from "@/assets/images/icons/Google.svg";
import { useFetchColor } from "@/hooks/useFetchColor";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Bento from "@/components/ui/Bento";

type Props = {
  id: number;
  setColor: (color: string) => void;
  shouldPlay: boolean;
  shouldFetch: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const Details = memo(
  ({ id, setColor, shouldPlay, shouldFetch, index, scrollY }: Props) => {
    const { isLoading, data, error } = useFetchInfo(id, shouldFetch);
    const color = useFetchColor(data?.posterPath);
    const { height: AVAILABLE_HEIGHT } = useWindowDimensions();

    useEffect(() => {
      if (shouldPlay) setColor(color);
    }, [color, shouldPlay]);

    // Animated styles for scaling and opacity
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * AVAILABLE_HEIGHT,
        index * AVAILABLE_HEIGHT,
        (index + 1) * AVAILABLE_HEIGHT,
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
            height: AVAILABLE_HEIGHT,
          }}
        />
      );
    }

    return (
      <Animated.View
        style={[
          {
            height: AVAILABLE_HEIGHT,
          },
          animatedStyle, // Apply animated styles
        ]}
        className={`flex w-full flex-1 flex-col items-start justify-end gap-3 px-4 bg-blue-400`}
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
                <Text className={"text-default"}>{data.ratings[0].value}</Text>
              </View>
              <View className={"flex flex-row items-center gap-2"}>
                <RottenTomatoLogo />
                <Text className={"text-default"}>{data.ratings[1].value}</Text>
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
              numberOfLines={5}
              ellipsizeMode="tail"
              className={"text-small flex-1 overflow-hidden"}
            >
              {data.overview}
            </Text>
          </View>
        </Bento>
        <Bento>
          <Google />
        </Bento>
      </Animated.View>
    );
  },
);
