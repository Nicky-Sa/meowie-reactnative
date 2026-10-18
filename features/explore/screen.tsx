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
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { MediaType } from "@/features/common/data/models/media-type";
import { COLLECTIONS_TAB, ExploreTabBar } from "@/features/explore/tab-bar";
import { useFetchExploreTabs } from "@/features/explore/data/use-fetch-explore-tabs";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { OnTabChangeCallback, Tabs } from "react-native-collapsible-tab-view";
import { Header } from "@/features/explore/header";
import { TabContent } from "@/features/explore/tab-content";
import { tailwind } from "@/lib/tailwind";
import { useScrollDownProgress } from "@/features/common/hooks/list/use-scroll-down-progress";

const headerBackgroundColor =
  tailwind.theme.backgroundColor.neutral[15].default;

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
  // A tab change skips React state, so a swipe doesn't re-render every tab.
  // selectedSlugs only catches up when the media type changes.
  const shownSlug = useRef(activeSlug);
  const activeTabName = useSharedValue(`${mediaType}-${activeSlug}`);
  const activeScrollY = useDerivedValue(
    () => scrollPositions.value[activeTabName.value] ?? 0,
  );
  const { progress: headerAnimation, reset: resetHeader } =
    useScrollDownProgress({ scrollY: activeScrollY, tabName: activeTabName });

  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeScrollY.value,
      // Wider range = gentler fade. Tweak if you want it faster or slower.
      [0, 150],
      ["transparent", headerBackgroundColor],
    ),
    transform: [{ translateY: -headerHeight * headerAnimation.value }],
  }));

  useEffect(() => {
    shownSlug.current = activeSlug;
    activeTabName.value = `${mediaType}-${activeSlug}`;
  }, [mediaType, activeSlug, activeTabName]);

  const onHeaderLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setHeaderHeight(layout.height);
  };

  const { discovery } = useAnalytics();

  const onTabChange: OnTabChangeCallback = ({ tabName }) => {
    resetHeader();
    shownSlug.current = tabName;
    activeTabName.value = `${mediaType}-${tabName}`;
  };

  const onMediaTypeChange = (nextMediaType: MediaType) => {
    if (nextMediaType === mediaType) return;
    resetHeader();
    setSelectedSlugs((current) => ({
      ...current,
      [mediaType]: shownSlug.current,
    }));
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
