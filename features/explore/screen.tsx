import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
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
import { ErrorState } from "@/features/general/error-state";
import Animated from "react-native-reanimated";
import { OnTabChangeCallback, Tabs } from "react-native-collapsible-tab-view";
import { Header } from "@/features/explore/header";
import { ExplorePosters } from "@/features/explore/posters";
import { CollectionsList } from "@/features/explore/collections/collections-list";
import { TabContent } from "@/features/common/tab/tab-content";
import { TabsLoading } from "@/features/common/tab/tabs-loading";
import { useTabsHeader } from "@/features/common/tab/use-tabs-header";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { tailwind } from "@/lib/tailwind";

const LOADING_TAB_COUNT = 3;

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
  const { paddingBottom } = useMainScreenContentStyle();
  const {
    topBarHeight,
    headerHeight,
    headerStyle,
    onTopBarLayout,
    onTabBarLayout,
    isTabReady,
    onTabReady,
    scrollPositions,
    activeTabName,
    resetHeader,
  } = useTabsHeader({
    initialTabName: `${mediaType}-${activeSlug}`,
    tabsKey: mediaType,
  });
  const showLoading = isPending || (!!tabs && !isTabReady);
  // A tab change skips React state, so a swipe doesn't re-render every tab.
  // selectedSlugs only catches up when the media type changes.
  const shownSlug = useRef(activeSlug);

  useEffect(() => {
    shownSlug.current = activeSlug;
    activeTabName.value = `${mediaType}-${activeSlug}`;
  }, [mediaType, activeSlug, activeTabName]);

  const { explore, filters, interaction } = useAnalytics();

  const onTabChange: OnTabChangeCallback = ({ tabName }) => {
    explore.trackTabChanged({ tabSlug: tabName, mediaType });
    resetHeader();
    shownSlug.current = tabName;
    activeTabName.value = `${mediaType}-${tabName}`;
  };

  const onMediaTypeChange = (nextMediaType: MediaType) => {
    if (nextMediaType === mediaType) return;
    interaction.trackMediaTypeToggled({
      screen: "explore",
      mediaType: nextMediaType,
    });
    resetHeader();
    setSelectedSlugs((current) => ({
      ...current,
      [mediaType]: shownSlug.current,
    }));
    setMediaType(nextMediaType);
  };

  const onFilterPress = () => {
    filters.trackFiltersOpened();
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
                    tabName={`${mediaType}-${tab.slug}`}
                    headerHeight={headerHeight}
                    scrollPositions={scrollPositions}
                    onReady={onTabReady}
                  >
                    {({ scrollHandler, scrollY, isDragging }) => (
                      <ExplorePosters
                        mediaType={mediaType}
                        tab={tab}
                        scrollHandler={scrollHandler}
                        scrollY={scrollY}
                        isDragging={isDragging}
                        headerHeight={headerHeight}
                      />
                    )}
                  </TabContent>
                </Tabs.Tab>
              )),
              <Tabs.Tab key={COLLECTIONS_TAB} name={COLLECTIONS_TAB}>
                <TabContent
                  tabName={`${mediaType}-${COLLECTIONS_TAB}`}
                  headerHeight={headerHeight}
                  scrollPositions={scrollPositions}
                  onReady={onTabReady}
                >
                  {({ scrollHandler }) => (
                    <View className="flex-1 px-4">
                      <CollectionsList
                        mediaType={mediaType}
                        scrollHandler={scrollHandler}
                        contentInsetAdjustmentBehavior="never"
                        contentContainerStyle={{
                          paddingTop:
                            headerHeight + Number(tailwind.theme.spacing["2"]),
                          paddingBottom,
                        }}
                      />
                    </View>
                  )}
                </TabContent>
              </Tabs.Tab>,
            ]}
          </Tabs.Container>
        ) : null}
        {topBarHeight > 0 && showLoading ? (
          <TabsLoading
            topBarHeight={topBarHeight}
            tabCount={LOADING_TAB_COUNT}
            scrollable
            onTabBarLayout={onTabBarLayout}
          />
        ) : null}
      </SafeAreaView>
    </MainScreen>
  );
};
