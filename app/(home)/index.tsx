import { GradientBg } from "@/components/ui/random-gradient-bg";
import { useFetchInfo } from "@/hooks/TMDB/useFetchInfo";
import { View, Text } from "react-native";
import { TrailerPlayer } from "@/components/video-details/TrailerPlayer";

export default function HomeScreen() {
  // const color = useFetchColor(
  //   "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
  // );
  const color = "#9CDFFF";
  const { isLoading, data, error } = useFetchInfo(155);

  if (isLoading || !data) {
    return <Text>Loading...</Text>;
  }

  return (
    <GradientBg colors={[`${color}80`, "transparent"]}>
      <View
        className={`flex h-full w-full flex-col items-start justify-center gap-2 p-4 pt-16`}
      >
        <Text className={"text-4xl font-bold text-text-primary"}>
          {data.title}
        </Text>
        <View className={"flex flex-row gap-8"}>
          <Text className={"text-text-muted-foreground"}>
            {data.publish_year}
          </Text>
          <Text className={"text-text-muted-foreground"}>
            {data.certification}
          </Text>
          <Text className={"text-text-muted-foreground"}>{data.duration}</Text>
        </View>
        <TrailerPlayer YTKey={data.trailerKey} />
      </View>
    </GradientBg>
  );
}
