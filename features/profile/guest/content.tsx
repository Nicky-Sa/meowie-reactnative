import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { Bookmark, Eye } from "iconoir-react-native";
import { BookmarkedList } from "@/features/profile/guest/bookmarked-list";
import { SeenList } from "@/features/profile/guest/seen-list";
import { Header } from "@/features/profile/guest/header";
import { TabBar, TabElement } from "@/features/common/tab/tab-bar";

const tabs: TabElement[] = [
  {
    name: "saved",
    title: "Saved",
    icon: Bookmark,
    children: BookmarkedList,
  },
  {
    name: "seen",
    title: "Seen",
    icon: Eye,
    children: SeenList,
  },
];

export const Guest = () => {
  return (
    <View className={"flex flex-1 flex-col"}>
      <Header />
      <Tabs.Container
        renderTabBar={(props) => <TabBar tabs={tabs} {...props} />}
      >
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.name} name={tab.name}>
            <tab.children />
          </Tabs.Tab>
        ))}
      </Tabs.Container>
    </View>
  );
};
