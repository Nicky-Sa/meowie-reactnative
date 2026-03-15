import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { TvDetails } from "@/features/media/tv/tv-details";

export const Screen = () => {
  const { tvId } = useLocalSearchParams<{ tvId: string }>();
  return (
    <InnerScreen title={"TV Details"}>
      <View className={"flex-1 items-center justify-center"}>
        <TvDetails tvId={tvId} inScreen />
      </View>
    </InnerScreen>
  );
};
