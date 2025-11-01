import { Text, View } from "react-native";
import { Button } from "@/features/common/button";
import { useRouter } from "expo-router";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import EmptyState from "@/assets/images/errors/empty-state.svg";

export const MoviesEmptyState = () => {
  const { height } = useScreenDimensions();
  const router = useRouter();

  const tryAgain = () => {
    router.push("/filters");
  };

  return (
    <View
      className={"flex-col items-center justify-center gap-8"}
      style={{
        height,
      }}
    >
      <EmptyState />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        No movies matched your filters! {"\n"}
        Please select different filters.
      </Text>
      <Button onPress={tryAgain} variant={"white"}>
        Open Filters
      </Button>
    </View>
  );
};
