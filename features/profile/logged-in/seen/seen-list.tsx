import { View, Text } from "react-native";
import EmptySeen from "@/assets/images/profile/empty-seen.svg";
import { TabChildProps } from "@/features/common/tab/tab-bar";

type Props = TabChildProps;

export const SeenList = ({ scrollHandler }: Props) => {
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptySeen />
      <Text className={"body-b1 w-1/2 text-center text-neutral-5-default"}>
        ${`Tracking what you've seen is coming soon...`}
      </Text>
    </View>
  );
};
