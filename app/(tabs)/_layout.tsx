import { Navbar } from "@/features/general/navbar";
import { Bookmark, HomeSimple, Search, User } from "iconoir-react-native";
import { Tab } from "@/features/general/navbar/types";

const tabs: Tab[] = [
  {
    name: "movies",
    title: "Home",
    icon: HomeSimple,
  },
  {
    name: "search",
    title: "Search",
    icon: Search,
  },
  {
    name: "watchlist",
    title: "Watchlist",
    icon: Bookmark,
  },
  {
    name: "profile",
    title: "Profile",
    icon: User,
  },
];

export default function TabsLayout() {
  return <Navbar tabs={tabs} />;
}
