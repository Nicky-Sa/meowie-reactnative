import { Navbar } from "@/features/general/navbar";
import { HomeSimple, Search, User } from "iconoir-react-native";
import { Tab } from "@/features/general/navbar/types";

const tabs: Tab[] = [
  {
    name: "movies",
    title: "Home",
    icon: HomeSimple,
  },
  {
    name: "explore",
    title: "Explore",
    icon: Search,
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
