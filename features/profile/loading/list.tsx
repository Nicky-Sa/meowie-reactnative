import { View } from "react-native";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import { useGridItemWidth } from "@/features/common/hooks/list/use-grid-item-width";

const NUM_COLUMNS = 3;

export const List = () => {
  const { itemWidth } = useGridItemWidth({ numColumns: NUM_COLUMNS });

  return (
    <View className={"flex flex-1 flex-col justify-start gap-8"}>
      <PostersSkeletons width={itemWidth} number={NUM_COLUMNS} />
    </View>
  );
};
