import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SeriesDetails } from "@/features/media/series/series-details";

export const Screen = () => {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  return (
    <InnerScreen title={"Series Details"}>
      <View className={"flex-1 items-center justify-center"}>
        <SeriesDetails seriesId={seriesId} inScreen />
      </View>
    </InnerScreen>
  );
};
