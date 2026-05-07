import { InnerScreen } from "@/features/common/layout/inner-screen";
import { View } from "react-native";
import { SeriesInfo } from "@/features/media/series/info/series-info";

export const Screen = ({ id }: { id: string }) => {
  return (
    <InnerScreen title={"Series Info"}>
      <View className={"flex-1 items-center justify-center"}>
        <SeriesInfo seriesId={id} inScreen />
      </View>
    </InnerScreen>
  );
};
