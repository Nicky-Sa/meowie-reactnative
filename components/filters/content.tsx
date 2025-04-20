import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "@/components/common/button";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import AltArrowRight from "@/assets/icons/alt-arrow-right.svg";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterItem } from "@/components/filters/item";

const filters = [
  {
    title: "Genre",
  },
  {
    title: "Year (decade)",
  },
  {
    title: "Language",
  },
  {
    title: "TMDB Rating",
  },
];

export const Content = () => {
  const router = useRouter();

  return (
    <View className={"flex-1 bg-neutral-13-default"}>
      <SafeAreaView>
        <View className={"flex h-full flex-col justify-between p-4"}>
          <View
            className={"flex w-full flex-row items-center justify-start gap-3"}
          >
            <Button
              onPress={router.back}
              variant={"secondary"}
              size={"md"}
              square
            >
              <ArrowLeft />
            </Button>
            <Text className={"title-t2-strong text-neutral-10-default"}>
              Filters
            </Text>
          </View>

          <View className={"flex w-full flex-col gap-2"}>
            {filters.map((filter) => (
              <FilterItem key={filter.title} title={filter.title} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
