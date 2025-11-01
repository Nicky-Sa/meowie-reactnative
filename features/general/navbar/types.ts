import { ForwardRefExoticComponent, RefAttributes } from "react";
import Svg, { SvgProps } from "react-native-svg";

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
  icon: ForwardRefExoticComponent<SvgProps & RefAttributes<Svg>>;
};
