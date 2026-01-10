import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { SearchTrigger } from "@/features/explore/search-trigger";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Filter } from "iconoir-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { initialFiltersValue } from "@/features/common/data/query";
import { useCallback } from "react";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

export const Screen = () => {
  const router = useRouter();
  const [, setFilters] = useAtom(filtersAtom);

  const { capture } = useCaptureEvent();

  const onFilterPress = () => {
    capture("filters_opened");
    router.push("/filters");
  };

  // clear filters when coming back to explore
  useFocusEffect(
    useCallback(() => {
      setFilters(initialFiltersValue);
    }, [setFilters]),
  );

  return (
    <MainScreen>
      <SafeAreaView
        className={"flex flex-1 flex-col justify-between px-4 pt-2"}
        edges={["top", "left", "right"]}
      >
        <View
          className={"flex w-full flex-row items-center justify-between gap-2"}
        >
          <View className={"flex-grow"}>
            <SearchTrigger />
          </View>
          <Button
            onPress={onFilterPress}
            variant={"ghost"}
            size={"md"}
            iconOnly
          >
            <Icon i={Filter} />
          </Button>
        </View>
      </SafeAreaView>
    </MainScreen>
  );
};
