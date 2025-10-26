import { Navbar } from "@/features/general/navbar";
import { Bookmark, HomeSimple, Search, User } from "iconoir-react-native";

const tabs = [
  {
    name: "movies/index",
    title: "Home",
    icon: HomeSimple,
  },
  {
    name: "search/index",
    title: "Search",
    icon: Search,
  },
  {
    name: "watchlist/index",
    title: "Watchlist",
    icon: Bookmark,
  },
  {
    name: "profile/index",
    title: "Profile",
    icon: User,
  },
];

export default function TabsLayout() {
  return <Navbar tabs={tabs} />;
}
