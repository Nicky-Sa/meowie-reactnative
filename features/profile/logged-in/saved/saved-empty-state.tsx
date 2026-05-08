import EmptySaved from "@/assets/images/meowie/empty-saved.svg";
import { View, Text } from "react-native";

export const SavedEmptyState = () => {
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptySaved />
      <Text className={"body-b1 w-2/3 text-center text-neutral-5-default"}>
        You haven&#39;t saved anything yet.
      </Text>
    </View>
  );
};
