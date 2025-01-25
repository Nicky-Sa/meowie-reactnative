import { GradientBg } from "@/components/ui/GradientBg";
import { useFetchInfo } from "@/hooks/TMDB/useFetchInfo";
import { View, Text, Dimensions, Image, ScrollView } from "react-native";
import { TrailerPlayer } from "@/components/videoDetails/TrailerPlayer";
import IMDBLogo from "@/assets/images/ratings/IMDB.svg";
import RottenTomatoLogo from "@/assets/images/ratings/Rotten_Tomatoes.svg";
import Chip from "@/components/ui/Chip";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  id: number;
  shouldPlay: boolean;
};

export const Details = ({ id, shouldPlay }: Props) => {
  // const color = useFetchColor(
  //   "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
  // );
  const color = "#9CDFFF";
  const { isLoading, data, error } = useFetchInfo(id);

  if (isLoading || !data) {
    return <Text>Loading...</Text>;
  }

  return (
    <GradientBg colors={[`${color}75`, "transparent"]}>
      <View
        className={`flex w-full flex-1 flex-col items-start justify-center gap-1 p-4 pt-12`}
        style={{ height: SCREEN_HEIGHT }}
      >
        <Text className={"text-text-primary-foreground text-4xl font-bold"}>
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
          className={"my-5 grow-0"}
          contentContainerClassName={"flex flex-row gap-2"}
        >
          {data.keywords.map((keyword) => (
            <Chip key={keyword} text={keyword} />
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
};
