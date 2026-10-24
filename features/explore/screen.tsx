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
import { Loading } from "@/features/explore/loading/content";
import { ErrorState } from "@/features/general/error-state";
import Animated, {
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
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  // Stays 0 until both parts are measured, so nothing is placed with a wrong height.
  const headerHeight =
    topBarHeight > 0 && tabBarHeight > 0 ? topBarHeight + tabBarHeight : 0;
  // The tab library mounts the open tab a moment late, so the loading
  // skeleton stays on top until that tab has drawn.
  const [isTabReady, setIsTabReady] = useState(false);
  const showLoading = isPending || (!!tabs && !isTabReady);
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

  const onTopBarLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setTopBarHeight(layout.height);
  };

  const onTabBarLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setTabBarHeight(layout.height);
  };

  const onTabReady = useCallback(() => setIsTabReady(true), []);

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
    setIsTabReady(false);
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
        <View className="absolute left-0 right-0 top-0 z-10">
          <Header
            mediaType={mediaType}
            onMediaTypeChange={onMediaTypeChange}
            onFilterPress={onFilterPress}
            onLayout={onTopBarLayout}
            style={headerStyle}
          />
        </View>
        {topBarHeight === 0 ? null : error && !tabs ? (
          <View className={"flex-1 px-4"} style={{ paddingTop: topBarHeight }}>
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
            containerStyle={{ opacity: isTabReady ? 1 : 0 }}
            headerContainerStyle={{
              backgroundColor: "transparent",
              shadowOpacity: 0,
              elevation: 0,
            }}
            renderTabBar={({ indexDecimal, onTabPress }) => (
              <Animated.View
                style={[headerStyle, { marginTop: topBarHeight }]}
                onLayout={onTabBarLayout}
              >
                <ExploreTabBar
                  tabs={tabs}
                  indexDecimal={indexDecimal}
                  onTabPress={onTabPress}
                />
              </Animated.View>
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
                    onReady={onTabReady}
                  />
                </Tabs.Tab>
              )),
              <Tabs.Tab key={COLLECTIONS_TAB} name={COLLECTIONS_TAB}>
                <TabContent
                  mediaType={mediaType}
                  tab={null}
                  headerHeight={headerHeight}
                  scrollPositions={scrollPositions}
                  onReady={onTabReady}
                />
              </Tabs.Tab>,
            ]}
          </Tabs.Container>
        ) : null}
        {topBarHeight > 0 && showLoading ? (
          <View className="absolute inset-0">
            <Loading
              topBarHeight={topBarHeight}
              onTabBarLayout={onTabBarLayout}
            />
          </View>
        ) : null}
      </SafeAreaView>
    </MainScreen>
  );
};
