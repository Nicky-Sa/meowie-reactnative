import { SvgImage } from "@/features/common/icon";

export type TabsName = "movies" | "search" | "watchlist" | "profile";

export type RootTabParamList = {
  Movies: undefined;
  Search: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

export type Tab = {
  name: TabsName;
  title: string;
  icon: SvgImage;
};
