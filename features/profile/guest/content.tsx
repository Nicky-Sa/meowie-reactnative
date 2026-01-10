import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { Bookmark, Eye } from "iconoir-react-native";
import { SavedList } from "@/features/profile/guest/saved-list";
import { SeenList } from "@/features/profile/guest/seen-list";
import { Header } from "@/features/profile/guest/header";
import { TabBar, TabConfig } from "@/features/common/tab/tab-bar";
import { TabHeader } from "@/features/common/tab/tab-header";
import { SharedValue } from "react-native-reanimated";

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
  scrollY: SharedValue<number>;
};

export const Guest = ({ scrollY }: Props) => {
  return (
    <View className={"flex flex-1 flex-col gap-8"}>
      <TabHeader scrollY={scrollY}>
        <Header />
      </TabHeader>
      <Tabs.Container
        renderTabBar={(props) => <TabBar tabsConfig={tabsConfig} {...props} />}
      >
        <Tabs.Tab name={tabsConfig[0].name}>
          <SavedList />
        </Tabs.Tab>

        <Tabs.Tab name={tabsConfig[1].name}>
          <SeenList />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};
