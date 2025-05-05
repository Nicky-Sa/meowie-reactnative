import { Text, View } from "react-native";
import Rive, { Alignment } from "rive-react-native";
import { Button } from "@/components/common/button";
import { useContentScreenSize } from "@/components/movies/elements/hooks";
import { useRouter } from "expo-router";

export const MoviesEmptyState = () => {
  const { height } = useContentScreenSize();
  const router = useRouter();

  const tryAgain = () => {
    router.push("/filters");
  };

  return (
    <View
      className={"flex-col items-center justify-center gap-10"}
      style={{
        height,
      }}
    >
      <View className={"flex h-[25%] w-full flex-col gap-4"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-filter-empty-state.riv"
          alignment={Alignment.Center}
        />
        <Text className={"body-b1 text-center text-neutral-5-default"}>
          No movies matched your filters!
        </Text>
        <Text className={"body-b1 -mt-2 text-center text-neutral-5-default"}>
          Please select different filters.
        </Text>
      </View>
      <Button haptic onPress={tryAgain} variant={"primary"}>
        Open Filters
      </Button>
    </View>
  );
};
