import { View } from "react-native";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import { usePosterWidth } from "@/features/common/posters/usePosterWidth";

const NUM_COLUMNS = 3;

export const List = () => {
  const { posterWidth } = usePosterWidth({ numColumns: NUM_COLUMNS });

  return (
    <View className={"flex flex-1 flex-col justify-start gap-8"}>
      <PostersSkeletons width={posterWidth} number={NUM_COLUMNS} />
    </View>
  );
};
