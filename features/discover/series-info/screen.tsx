import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SeriesInfo } from "@/features/media/series/info/series-info";

export const Screen = () => {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  return (
    <InnerScreen title={"Series Info"}>
      <View className={"flex-1 items-center justify-center"}>
        <SeriesInfo seriesId={seriesId} inScreen />
      </View>
    </InnerScreen>
  );
};
