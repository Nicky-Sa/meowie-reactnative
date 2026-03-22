import EmptySaved from "@/assets/images/profile/empty-saved.svg";
import { View, Text } from "react-native";

export const SavedEmptyState = () => {
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptySaved />
      <Text className={"body-b1 w-1/2 text-center text-neutral-5-default"}>
        Save content you want to watch later.
      </Text>
    </View>
  );
};
