import { SvgImage } from "@/features/common/ui/icon";

export type TabsName = "home" | "explore" | "profile";

export type RootTabParamList = {
  Movies: undefined;
  Explore: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

export type Tab = {
  name: TabsName;
  title: string;
  icon: SvgImage;
};
