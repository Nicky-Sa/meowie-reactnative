import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { Bookmark, Eye } from "iconoir-react-native";
import { BookmarkedList } from "@/features/profile/logged-in/bookmarked-list";
import { SeenList } from "@/features/profile/logged-in/seen-list";
import { TabBar, TabElement } from "@/features/common/tab/tab-bar";
import { Header } from "@/features/profile/logged-in/header";
import { User } from "@/entities/user";

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

type Props = {
  user: User;
};

export const LoggedIn = ({ user }: Props) => {
  return (
    <View className={"flex flex-1 flex-col"}>
      <Header email={user.email} />
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
