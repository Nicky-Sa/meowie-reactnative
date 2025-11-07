import { SvgImage } from "@/features/common/icon";

export type TabsName =
  | "movies/index"
  | "search/index"
  | "watchlist/index"
  | "profile/index";

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
