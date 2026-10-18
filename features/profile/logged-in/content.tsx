import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { Bookmark, Eye } from "iconoir-react-native";
import { SavedList } from "@/features/profile/logged-in/saved/saved-list";
import { SeenList } from "@/features/profile/logged-in/seen/seen-list";
import { TabConfig } from "@/features/common/tab/tab-bar";
import { ProfileTabBar } from "@/features/profile/tab-bar";
import { Header } from "@/features/profile/logged-in/header";
import { User } from "@/entities/user";
import { TabContent } from "@/features/common/tab/tab-content";
import { ScrollHandlerProcessed, SharedValue } from "react-native-reanimated";
import { TabHeader } from "@/features/common/tab/tab-header";

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

type Props = {
  user: User;
  scrollY: SharedValue<number>;
  scrollHandler: ScrollHandlerProcessed;
};

export const LoggedIn = ({ user, scrollY, scrollHandler }: Props) => {
  return (
    <View className={"flex flex-1 flex-col gap-8"}>
      <TabHeader scrollY={scrollY}>
        <Header email={user.email} />
      </TabHeader>
      <Tabs.Container
        renderTabBar={(props) => (
          <ProfileTabBar tabsConfig={tabsConfig} {...props} />
        )}
      >
        <Tabs.Tab name={tabsConfig[0].name}>
          <TabContent>
            <SavedList scrollHandler={scrollHandler} />
          </TabContent>
        </Tabs.Tab>

        <Tabs.Tab name={tabsConfig[1].name}>
          <TabContent>
            <SeenList scrollHandler={scrollHandler} />
          </TabContent>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};
