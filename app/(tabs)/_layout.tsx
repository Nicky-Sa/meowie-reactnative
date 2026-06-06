import { Navbar } from "@/features/general/navbar";
import { HomeSimple, Search, User } from "iconoir-react-native";
import { Tab } from "@/features/general/navbar/types";
import { useSetupTour } from "@/features/common/ui/tour/use-setup-tour";

const tabs: Tab[] = [
  {
    name: "home",
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
  useSetupTour();
  return <Navbar tabs={tabs} />;
}
