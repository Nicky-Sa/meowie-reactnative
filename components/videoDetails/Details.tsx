import { GradientBg } from "@/components/ui/GradientBg";
import { useFetchInfo } from "@/hooks/TMDB/useFetchInfo";
import { View, Text, Dimensions, Image, ScrollView } from "react-native";
import { TrailerPlayer } from "@/components/videoDetails/TrailerPlayer";
import IMDBLogo from "@/assets/images/ratings/IMDB.svg";
import RottenTomatoLogo from "@/assets/images/ratings/Rotten_Tomatoes.svg";
import Chip from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { useFetchColor } from "@/hooks/useFetchColor";
import { memo } from "react";
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  id: number;
  shouldPlay: boolean;
  shouldFetch: boolean;
};

export const Details = memo(
  ({ id, shouldPlay, shouldFetch }: Props) => {
    const { isLoading, data, error } = useFetchInfo(id, shouldFetch);
    const color = useFetchColor(data?.posterPath);
    // const color = "#9CDFFF";

    if (isLoading || !data) {
      return (
        <View
          className={"flex-1 items-center justify-center"}
          style={{
            height: SCREEN_HEIGHT,
          }}
        >
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <GradientBg colors={[`${color}75`, "transparent"]}>
        <View
          className={`flex w-full flex-1 flex-col items-start justify-center gap-1 p-4 pt-12`}
          style={{ height: SCREEN_HEIGHT }}
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
      </GradientBg>
    );
  },
);
