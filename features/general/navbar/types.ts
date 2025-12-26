import { SvgImage } from "@/features/common/icon";

export type TabsName = "movies" | "explore" | "watchlist" | "profile";

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
