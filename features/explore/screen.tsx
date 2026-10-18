import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutChangeEvent, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { filtersMediaTypeAtom, movieFiltersAtom, tvFiltersAtom } from "@/atoms";
import {
  initialMovieFiltersValue,
  initialSeriesFiltersValue,
} from "@/features/common/data/media-query";
import { useCallback, useState } from "react";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { MediaType } from "@/features/common/data/models/media-type";
import { COLLECTIONS_TAB, ExploreTabBar } from "@/features/explore/tab-bar";
import { useFetchExploreTabs } from "@/features/explore/data/use-fetch-explore-tabs";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";
import {
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { OnTabChangeCallback, Tabs } from "react-native-collapsible-tab-view";
import { Header } from "@/features/explore/header";
import { TabContent } from "@/features/explore/tab-content";
import { tailwind } from "@/lib/tailwind";

const headerBackgroundColor =
  tailwind.theme.backgroundColor.neutral[15].default;

// Same color, but fully transparent. Fading from "transparent" (black at 0%)
// makes a muddy dark flash, so we fade from the SAME color with alpha 0.
// Works when headerBackgroundColor is a 6-digit hex like "#1a1a1a".
const headerTransparentColor = `${headerBackgroundColor}00`;

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
  const activeSlug = isCollectionsTab ? COLLECTIONS_TAB : selectedTab.slug;
  const setFiltersMediaType = useSetAtom(filtersMediaTypeAtom);
  const setMovieFilters = useSetAtom(movieFiltersAtom);
  const setTvFilters = useSetAtom(tvFiltersAtom);
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollPositions = useSharedValue<Record<string, number>>({});
  const activeTabName = useDerivedValue(() => `${mediaType}-${activeSlug}`);
  const headerAnimation = useSharedValue(0);
  const isHeaderHidden = useSharedValue(false);

  useAnimatedReaction(
    () => ({
      tabName: activeTabName.value,
      scrollY: scrollPositions.value[activeTabName.value] ?? 0,
    }),
    (current, previous) => {
      if (previous === null || current.tabName !== previous.tabName) return;
      const scrollChange = current.scrollY - previous.scrollY;

      if (current.scrollY < 10 && isHeaderHidden.value) {
        isHeaderHidden.value = false;
        headerAnimation.value = withTiming(0, { duration: 200 });
        return;
      }

      if (scrollChange > 2 && current.scrollY > 50 && !isHeaderHidden.value) {
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
    backgroundColor: interpolateColor(
      scrollPositions.value[activeTabName.value] ?? 0,
      // Wider range = gentler fade. Tweak if you want it faster or slower.
      [0, 150],
      [headerTransparentColor, headerBackgroundColor],
    ),
    transform: [{ translateY: -headerHeight * headerAnimation.value }],
  }));

  const onHeaderLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setHeaderHeight(layout.height);
  };

  const { discovery } = useAnalytics();

  const onTabChange: OnTabChangeCallback = ({ tabName }) => {
    isHeaderHidden.value = false;
    headerAnimation.value = 0;
    setSelectedSlugs((current) => ({ ...current, [mediaType]: tabName }));
  };

  const onMediaTypeChange = (label: string) => {
    const nextMediaType = label === "Movies" ? "movie" : "series";
    if (nextMediaType === mediaType) return;
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
          <Tabs.Container
            key={mediaType}
            initialTabName={activeSlug}
            onTabChange={onTabChange}
            lazy
            cancelLazyFadeIn
            cancelTranslation
            headerContainerStyle={{
              backgroundColor: "transparent",
              shadowOpacity: 0,
              elevation: 0,
            }}
            renderTabBar={({ indexDecimal, onTabPress }) => (
              <Header
                mediaType={mediaType}
                onMediaTypeChange={onMediaTypeChange}
                onFilterPress={onFilterPress}
                onLayout={onHeaderLayout}
                style={headerStyle}
              >
                <View className="-mx-4">
                  <ExploreTabBar
                    tabs={tabs}
                    indexDecimal={indexDecimal}
                    onTabPress={onTabPress}
                  />
                </View>
              </Header>
            )}
          >
            {[
              ...tabs.map((tab) => (
                <Tabs.Tab key={tab.slug} name={tab.slug}>
                  <TabContent
                    mediaType={mediaType}
                    tab={tab}
                    headerHeight={headerHeight}
                    scrollPositions={scrollPositions}
                  />
                </Tabs.Tab>
              )),
              <Tabs.Tab key={COLLECTIONS_TAB} name={COLLECTIONS_TAB}>
                <TabContent
                  mediaType={mediaType}
                  tab={null}
                  headerHeight={headerHeight}
                  scrollPositions={scrollPositions}
                />
              </Tabs.Tab>,
            ]}
          </Tabs.Container>
        ) : null}
        {isPending || !tabs ? (
          <View className="absolute left-0 right-0 top-0 z-10">
            <Header
              mediaType={mediaType}
              onMediaTypeChange={onMediaTypeChange}
              onFilterPress={onFilterPress}
              onLayout={onHeaderLayout}
              style={headerStyle}
            />
          </View>
        ) : null}
      </SafeAreaView>
    </MainScreen>
  );
};
