import { GradientBg } from "@/components/ui/GradientBg";
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
import RottenTomatoLogo from "@/assets/images/ratings/Rotten_Tomatoes.svg";
import Chip from "@/components/ui/Chip";
import { useFetchColor } from "@/hooks/useFetchColor";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        className={`flex w-full flex-1 flex-col items-start justify-center gap-2 px-4`}
      >
        <View className={"flex flex-col"}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={"flex grow-0 -mx-4"}
          >
            <Text className={"text-title px-4"}>
              {data.title}
            </Text>
          </ScrollView>
          <View className={"flex flex-row gap-8"}>
            <Text className={"text-default"}>{data.publishYear}</Text>
            <Text className={"text-default"}>{data.certification}</Text>
            <Text className={"text-default"}>{data.duration}</Text>
          </View>
        </View>

        <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />
        <View className={"-mt-1.5 flex flex-row items-center gap-8"}>
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
          className={"my-3 w-full grow-0 overflow-visible"}
          contentContainerClassName={"flex flex-row gap-2"}
        >
          {data.genres.map((genre, index) => (
            <View key={genre}>
              <Chip text={genre} />
            </View>
          ))}
        </ScrollView>
        <View className={"flex h-[20%] flex-row justify-start gap-4"}>
          <Image
            src={data.posterPath}
            className={"basis-[28%] rounded-lg"}
            style={{
              aspectRatio: 2 / 3,
            }}
            resizeMode={"contain"}
          />
          <Text
            numberOfLines={7}
            ellipsizeMode="tail"
            className={"text-small flex-1 overflow-hidden"}
          >
            {data.overview}
          </Text>
        </View>
      </Animated.View>
    );
  },
);
