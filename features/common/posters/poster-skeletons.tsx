import { DimensionValue, View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { DEFAULT_NUM_COLUMNS } from "@/features/common/posters/posters.constants";

const ROW_COUNT = 4;

type Props = {
  numColumns?: number;
};

export const PostersSkeletons = ({
  numColumns = DEFAULT_NUM_COLUMNS,
}: Props) => {
  const cellWidth: DimensionValue = `${100 / numColumns}%`;
  return (
    <View className={"flex flex-row flex-wrap gap-y-2"}>
      {Array.from({ length: numColumns * ROW_COUNT }).map((_, index) => (
        <View key={index} className={"px-1"} style={{ width: cellWidth }}>
          <SkeletonItem
            className={"rounded-lg border border-neutral-4-default"}
            style={{ aspectRatio: 2 / 3 }}
          />
        </View>
      ))}
    </View>
  );
};
