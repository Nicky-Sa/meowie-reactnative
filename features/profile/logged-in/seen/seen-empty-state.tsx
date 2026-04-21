import EmptySeen from "@/assets/images/profile/empty-seen.svg";
import { View, Text } from "react-native";

export const SeenEmptyState = () => {
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptySeen />
      <Text className={"body-b1 w-2/3 text-center text-neutral-5-default"}>
        You haven&#39;t marked anything as seen yet.
      </Text>
    </View>
  );
};
