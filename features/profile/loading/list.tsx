import { View } from "react-native";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import { useGridItemWidth } from "@/features/common/hooks/list/use-grid-item-width";
import { tailwind } from "@/lib/tailwind";

const NUM_COLUMNS = 3;

export const List = () => {
  const gap = Number(tailwind.theme.spacing["2"]);
  const { itemWidth } = useGridItemWidth({
    numColumns: NUM_COLUMNS,
    gap,
    horizontalPadding: gap * 2,
  });

  return (
    <View className={"flex flex-1 flex-col justify-start gap-8 px-1"}>
      <PostersSkeletons width={itemWidth} number={NUM_COLUMNS} />
    </View>
  );
};
