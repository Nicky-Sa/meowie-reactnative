import NoMatch from "@/assets/images/errors/no-match.svg";
import { Text, View } from "react-native";

export const FilterEmptyState = () => {
  return (
    <View className={"flex-1 flex-col items-center justify-center gap-8"}>
      <NoMatch />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        Nothing matched your filters! {"\n"}
        Please try different filters.
      </Text>
    </View>
  );
};
