import { GradientBg } from "@/components/ui/GradientBg";
import { useFetchInfo } from "@/hooks/TMDB/useFetchInfo";
import { View, Text, Dimensions, Image, ScrollView } from "react-native";
import { TrailerPlayer } from "@/components/videoDetails/TrailerPlayer";
import IMDBLogo from "@/assets/images/ratings/IMDB.svg";
import RottenTomatoLogo from "@/assets/images/ratings/Rotten_Tomatoes.svg";
import Chip from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { useFetchColor } from "@/hooks/useFetchColor";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  id: number;
  scrollY: SharedValue<number>; // Scroll position
  index: number;
  setColor: (color: string) => void;
  shouldPlay: boolean;
  shouldFetch: boolean;
};

export const Details = memo(
  ({ id, scrollY, index,setColor, shouldPlay, shouldFetch }: Props) => {
    const { isLoading, data, error } = useFetchInfo(id, shouldFetch);
    const color = useFetchColor(data?.posterPath);
    console.log(index, shouldFetch, shouldPlay);


    // useEffect(() => {
    //   if (shouldPlay) setColor(color);
    // }, [color, shouldPlay]);
    // const color = "#9CDFFF";

    // Animate scale based on scroll position
    // const animatedStyle = useAnimatedStyle(() => {
    //   const scale = interpolate(
    //     scrollY.value,
    //     [
    //       (index - 1) * SCREEN_HEIGHT, // Previous item
    //       index * SCREEN_HEIGHT, // Current item
    //       (index + 1) * SCREEN_HEIGHT, // Next item
    //     ],
    //     [1.5, 1, 0.8], // Scale values
    //     { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    //   );

    //   return {
    //     transform: [{ scale }],
    //   };
    // });

    if (isLoading || !data) {
      return (
        <View
          className={"flex-1 items-center justify-center"}
          style={{
            height: SCREEN_HEIGHT,
          }}
        />
      );
    }


    return (
      <Animated.View
        style={[
          {
            height: SCREEN_HEIGHT,
          },
          // animatedStyle,
        ]}
      >
        <View
          className={cn(
            `flex h-full w-full flex-1 flex-col items-start justify-center gap-1 p-4 pt-12 transition-all duration-500`,
            // shouldPlay ? "opacity-100" : "opacity-80",
          )}
        >
          <Text className={"text-4xl font-bold text-text-primary-foreground"}>
            {data.title}
          </Text>
          <View className={"flex flex-row gap-8"}>
            <Text className={"text-default"}>{data.publishYear}</Text>
            <Text className={"text-default"}>{data.certification}</Text>
            <Text className={"text-default"}>{data.duration}</Text>
          </View>
          <TrailerPlayer YTKey={data.trailerKey} shouldPlay={shouldPlay} />
          <View className={"mt-1 flex flex-row items-center gap-8"}>
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
            className={"-mx-4 my-5 w-full grow-0"}
            contentContainerClassName={"flex flex-row"}
          >
            {data.genres.map((genre, index) => (
              <View
                className={cn(
                  index === 0 ? "ml-4 mr-1" : "mx-1",
                  index === data.genres.length - 1 ? "mr-4" : "",
                )}
                key={genre}
              >
                <Chip text={genre} />
              </View>
            ))}
          </ScrollView>
          <View className={"flex h-48 flex-row gap-4"}>
            <Image src={data.posterPath} className={"h-full w-32 rounded-xl"} />
            <Text
              numberOfLines={7}
              ellipsizeMode="tail"
              className={"text-small flex-1 overflow-hidden"}
            >
              {data.overview}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  },
);
