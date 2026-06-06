import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";

export const Header = () => {
  const { paddingTop } = useMainScreenContentStyle();

  return (
    <View
      className="mx-auto w-[50%] flex-col items-center justify-center gap-4"
      style={{ paddingTop }}
    >
      <SkeletonItem className={"h-[72px] w-[72px] rounded-full"} />
      <SkeletonItem className={"h-4"} />
    </View>
  );
};
