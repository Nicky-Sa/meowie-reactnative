import { Navbar } from "@/features/general/navbar";
import { Bookmark, HomeSimple, Search, User } from "iconoir-react-native";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import Svg, { SvgProps } from "react-native-svg";

export type TabsName =
  | "movies/index"
  | "search/index"
  | "watchlist/index"
  | "profile/index";

export type Tab = {
  name: TabsName;
  title: string;
  icon: ForwardRefExoticComponent<SvgProps & RefAttributes<Svg>>;
};

const tabs: Tab[] = [
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
