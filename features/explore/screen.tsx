import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { SearchTrigger } from "@/features/explore/search-trigger";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Filter } from "iconoir-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { movieFiltersAtom, tvFiltersAtom } from "@/atoms";
import {
  initialMovieFiltersValue,
  initialSeriesFiltersValue,
} from "@/features/common/data/media-query";
import { useCallback } from "react";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { CollectionsList } from "@/features/explore/collections/collections-list";

export const Screen = () => {
  const router = useRouter();
  const setMovieFilters = useSetAtom(movieFiltersAtom);
  const setTvFilters = useSetAtom(tvFiltersAtom);

  const { capture } = useCaptureEvent();

  const onFilterPress = () => {
    capture("filters_opened");
    router.push("/filters");
  };

  // clear filters when coming back to explore
  useFocusEffect(
    useCallback(() => {
      setMovieFilters(initialMovieFiltersValue);
      setTvFilters(initialSeriesFiltersValue);
    }, [setMovieFilters, setTvFilters]),
  );

  return (
    <MainScreen>
      <SafeAreaView
        className={"flex-1 px-4 pt-2"}
        edges={["top", "left", "right"]}
      >
        <View className={"flex flex-col gap-4"}>
          <View
            className={
              "flex w-full flex-row items-center justify-between gap-2"
            }
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

          <CollectionsList />
        </View>
      </SafeAreaView>
    </MainScreen>
  );
};
