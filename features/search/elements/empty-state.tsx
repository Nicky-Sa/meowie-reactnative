import NoMatchSearch from "@/assets/images/errors/no-match-search.svg";
import { Text, View } from "react-native";

export const SearchEmptyState = () => {
  return (
    <View className={"flex-1 flex-col items-center justify-center gap-8"}>
      <NoMatchSearch />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        Nothing matched your input! {"\n"}
        Please try something else.
      </Text>
    </View>
  );
};
