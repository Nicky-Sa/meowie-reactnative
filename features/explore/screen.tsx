import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Filter, Search } from "iconoir-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { filtersMediaTypeAtom, movieFiltersAtom, tvFiltersAtom } from "@/atoms";
import {
  initialMovieFiltersValue,
  initialSeriesFiltersValue,
} from "@/features/common/data/media-query";
import { useCallback, useState } from "react";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { CollectionsList } from "@/features/explore/collections/collections-list";
import { SlidingToggle } from "@/features/common/ui/sliding-toggle";
import { MediaType } from "@/features/common/data/models/media-type";
import { ExploreTabBar } from "@/features/explore/tab-bar";
import { useFetchExploreTabs } from "@/features/explore/data/use-fetch-explore-tabs";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";
import { EmptyState } from "@/features/general/empty-state";

const mediaTypes = ["Movies", "Series"];

export const Screen = () => {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [selectedSlug, setSelectedSlug] = useState<string>();
  const {
    data: tabs,
    isPending,
    error,
    refetch,
  } = useFetchExploreTabs(mediaType);
  const setFiltersMediaType = useSetAtom(filtersMediaTypeAtom);
  const setMovieFilters = useSetAtom(movieFiltersAtom);
  const setTvFilters = useSetAtom(tvFiltersAtom);

  const { discovery } = useAnalytics();

  const onFilterPress = () => {
    discovery.trackFiltersOpened();
    setFiltersMediaType(mediaType);
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
        <View className={"flex flex-1 flex-col gap-4"}>
          <View
            className={
              "flex w-full flex-row items-center justify-between gap-2"
            }
          >
            <Button
              onPress={onFilterPress}
              variant={"ghost"}
              size={"md"}
              iconPosition={"only"}
              icon={<Icon i={Filter} />}
            />
            <SlidingToggle
              containerClassName={"h-11 w-36"}
              items={mediaTypes}
              activeItem={mediaType === "movie" ? "Movies" : "Series"}
              setActiveItem={(label) =>
                setMediaType(label === "Movies" ? "movie" : "series")
              }
            />
            <Button
              onPress={() => router.push("/search")}
              accessibilityLabel={"Search"}
              variant={"ghost"}
              size={"md"}
              iconPosition={"only"}
              icon={<Icon i={Search} />}
            />
          </View>

          {isPending ? (
            <View className={"flex-1 items-center justify-center"}>
              <Loading />
            </View>
          ) : error && !tabs ? (
            <ErrorState error={error} tryAgain={refetch} />
          ) : tabs?.length ? (
            <>
              <View className={"-mx-4"}>
                <ExploreTabBar
                  key={mediaType}
                  tabs={tabs}
                  selectedSlug={selectedSlug}
                  onTabPress={setSelectedSlug}
                />
              </View>
              <CollectionsList />
            </>
          ) : (
            <EmptyState />
          )}
        </View>
      </SafeAreaView>
    </MainScreen>
  );
};
