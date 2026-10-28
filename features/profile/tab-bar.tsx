import { ComponentProps } from "react";
import { TabBar } from "@/features/common/tab/tab-bar";

export const ProfileTabBar = (props: ComponentProps<typeof TabBar>) => (
  <TabBar {...props} />
);
