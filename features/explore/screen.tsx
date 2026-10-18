import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutChangeEvent, View } from "react-native";
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
import { COLLECTIONS_TAB, ExploreTabBar } from "@/features/explore/tab-bar";
import { useFetchExploreTabs } from "@/features/explore/data/use-fetch-explore-tabs";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";
import { ExplorePosters } from "@/features/explore/posters";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { useScrollHandler } from "@/features/common/hooks/list/use-scroll-handler";
import { tailwind } from "@/lib/tailwind";

const mediaTypes = ["Movies", "Series"];

export const Screen = () => {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [selectedSlugs, setSelectedSlugs] = useState<
    Partial<Record<MediaType, string>>
  >({});
  const {
    data: tabs,
    isPending,
    error,
    refetch,
  } = useFetchExploreTabs(mediaType);
  const selectedSlug = selectedSlugs[mediaType];
  const selectedTab =
    tabs?.find((tab) => tab.slug === selectedSlug) ?? tabs?.[0];
  const isCollectionsTab = selectedSlug === COLLECTIONS_TAB || !selectedTab;
  const setFiltersMediaType = useSetAtom(filtersMediaTypeAtom);
  const setMovieFilters = useSetAtom(movieFiltersAtom);
  const setTvFilters = useSetAtom(tvFiltersAtom);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { scrollHandler, scrollY, resetScroll } = useScrollHandler();
  const headerAnimation = useSharedValue(0);
  const isHeaderHidden = useSharedValue(false);
  const { paddingBottom } = useMainScreenContentStyle();

  useAnimatedReaction(
    () => scrollY.value,
    (current, previous) => {
      if (previous === null) return;
      const scrollChange = current - previous;

      if (current < 10 && isHeaderHidden.value) {
        isHeaderHidden.value = false;
        headerAnimation.value = withTiming(0, { duration: 200 });
        return;
      }

      if (scrollChange > 2 && current > 50 && !isHeaderHidden.value) {
        isHeaderHidden.value = true;
        headerAnimation.value = withTiming(1, { duration: 300 });
      }

      if (scrollChange < -2 && isHeaderHidden.value) {
        isHeaderHidden.value = false;
        headerAnimation.value = withTiming(0, { duration: 300 });
      }
    },
  );

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -headerHeight * headerAnimation.value }],
  }));

  const onHeaderLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setHeaderHeight(layout.height);
  };

  const { discovery } = useAnalytics();

  const onTabPress = (slug: string) => {
    if (slug === (isCollectionsTab ? COLLECTIONS_TAB : selectedTab?.slug)) {
      return;
    }
    resetScroll();
    isHeaderHidden.value = false;
    headerAnimation.value = 0;
    setSelectedSlugs((current) => ({ ...current, [mediaType]: slug }));
  };

  const onMediaTypeChange = (label: string) => {
    const nextMediaType = label === "Movies" ? "movie" : "series";
    if (nextMediaType === mediaType) return;
    resetScroll();
    isHeaderHidden.value = false;
    headerAnimation.value = 0;
    setMediaType(nextMediaType);
  };

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
      <SafeAreaView className={"flex-1"} edges={["left", "right"]}>
        {isPending ? (
          <View
            className={"flex-1 items-center justify-center"}
            style={{ paddingTop: headerHeight }}
          >
            <Loading />
          </View>
        ) : error && !tabs ? (
          <View className={"flex-1 px-4"} style={{ paddingTop: headerHeight }}>
            <ErrorState error={error} tryAgain={refetch} />
          </View>
        ) : tabs ? (
          isCollectionsTab ? (
            <View className={"flex-1 px-4"}>
              <CollectionsList
                key={mediaType}
                mediaType={mediaType}
                scrollHandler={scrollHandler}
                contentInsetAdjustmentBehavior="never"
                contentContainerStyle={{
                  paddingTop:
                    headerHeight + Number(tailwind.theme.spacing["4"]),
                  paddingBottom,
                }}
              />
            </View>
          ) : (
            <ExplorePosters
              key={`${mediaType}-${selectedTab.slug}`}
              mediaType={mediaType}
              tab={selectedTab}
              scrollHandler={scrollHandler}
              headerHeight={headerHeight}
            />
          )
        ) : null}
        <Animated.View
          className={"absolute left-0 right-0 top-0 z-10 bg-neutral-15-default"}
          style={headerStyle}
          onLayout={onHeaderLayout}
        >
          <SafeAreaView edges={["top"]} className={"gap-4 px-4 pt-2"}>
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
                setActiveItem={onMediaTypeChange}
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

            {!isPending && tabs ? (
              <View className={"-mx-4"}>
                <ExploreTabBar
                  key={mediaType}
                  tabs={tabs}
                  selectedSlug={
                    isCollectionsTab ? COLLECTIONS_TAB : selectedTab.slug
                  }
                  onTabPress={onTabPress}
                />
              </View>
            ) : null}
          </SafeAreaView>
        </Animated.View>
      </SafeAreaView>
    </MainScreen>
  );
};
