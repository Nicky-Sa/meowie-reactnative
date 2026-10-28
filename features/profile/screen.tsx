import { View } from "react-native";
import Animated from "react-native-reanimated";
import { OnTabChangeCallback, Tabs } from "react-native-collapsible-tab-view";
import { Bookmark, Eye } from "iconoir-react-native";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { MainScreen } from "@/features/common/layout/main-screen";
import { TabConfig } from "@/features/common/tab/tab-bar";
import { TabContent } from "@/features/common/tab/tab-content";
import { TabsLoading } from "@/features/common/tab/tabs-loading";
import { useTabsHeader } from "@/features/common/tab/use-tabs-header";
import { Header } from "@/features/profile/header";
import { ProfileTabBar } from "@/features/profile/tab-bar";
import { SavedList } from "@/features/profile/logged-in/saved/saved-list";
import { SeenList } from "@/features/profile/logged-in/seen/seen-list";
import { SavedList as GuestSavedList } from "@/features/profile/guest/saved-list";
import { SeenList as GuestSeenList } from "@/features/profile/guest/seen-list";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

const tabsConfig: TabConfig[] = [
  {
    name: "saved",
    title: "Saved",
    icon: Bookmark,
  },
  {
    name: "seen",
    title: "Seen",
    icon: Eye,
  },
];

export const Screen = () => {
  const { data, isLoading } = useCurrentUser();
  const isLoggedIn = !!data?.user;
  const tabsKey = isLoggedIn ? "logged-in" : "guest";
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
  } = useTabsHeader({ initialTabName: tabsConfig[0].name, tabsKey });
  const showLoading = isLoading || !isTabReady;

  const { interaction } = useAnalytics();

  const onTabChange: OnTabChangeCallback = ({ tabName }) => {
    interaction.trackProfileTabChange({ tabName });
    resetHeader();
    activeTabName.value = tabName;
  };

  return (
    <MainScreen>
      <View className={"flex-1"}>
        <View className="absolute left-0 right-0 top-0 z-10">
          <Header onLayout={onTopBarLayout} style={headerStyle} />
        </View>
        {topBarHeight === 0 || isLoading ? null : (
          <Tabs.Container
            key={tabsKey}
            onTabChange={onTabChange}
            cancelTranslation
            containerStyle={{ opacity: isTabReady ? 1 : 0 }}
            headerContainerStyle={{
              backgroundColor: "transparent",
              shadowOpacity: 0,
              elevation: 0,
            }}
            renderTabBar={(props) => (
              <Animated.View
                style={[headerStyle, { marginTop: topBarHeight }]}
                onLayout={onTabBarLayout}
              >
                <ProfileTabBar
                  tabsConfig={tabsConfig}
                  className="bg-transparent"
                  {...props}
                />
              </Animated.View>
            )}
          >
            <Tabs.Tab name={tabsConfig[0].name}>
              <TabContent
                tabName={tabsConfig[0].name}
                headerHeight={headerHeight}
                scrollPositions={scrollPositions}
                onReady={onTabReady}
              >
                {({ scrollHandler }) =>
                  isLoggedIn ? (
                    <SavedList
                      scrollHandler={scrollHandler}
                      headerHeight={headerHeight}
                    />
                  ) : (
                    <GuestSavedList headerHeight={headerHeight} />
                  )
                }
              </TabContent>
            </Tabs.Tab>

            <Tabs.Tab name={tabsConfig[1].name}>
              <TabContent
                tabName={tabsConfig[1].name}
                headerHeight={headerHeight}
                scrollPositions={scrollPositions}
                onReady={onTabReady}
              >
                {({ scrollHandler }) =>
                  isLoggedIn ? (
                    <SeenList
                      scrollHandler={scrollHandler}
                      headerHeight={headerHeight}
                    />
                  ) : (
                    <GuestSeenList headerHeight={headerHeight} />
                  )
                }
              </TabContent>
            </Tabs.Tab>
          </Tabs.Container>
        )}
        {topBarHeight > 0 && showLoading ? (
          <TabsLoading
            topBarHeight={topBarHeight}
            tabCount={tabsConfig.length}
            scrollable={false}
            onTabBarLayout={onTabBarLayout}
          />
        ) : null}
      </View>
    </MainScreen>
  );
};
