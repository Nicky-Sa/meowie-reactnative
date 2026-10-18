import { ComponentProps } from "react";
import { TabBar } from "@/features/common/tab/tab-bar";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

export const ProfileTabBar = ({
  onTabPress,
  ...props
}: ComponentProps<typeof TabBar>) => {
  const { interaction } = useAnalytics();

  const onTabItemPress = (tabName: string) => {
    interaction.trackProfileTabChange({ tabName });
    if (tabName === "saved") {
      interaction.trackProfileSavedTabClick();
    } else if (tabName === "seen") {
      interaction.trackProfileSeenTabClick();
    }
    onTabPress(tabName);
  };

  return <TabBar {...props} onTabPress={onTabItemPress} />;
};
