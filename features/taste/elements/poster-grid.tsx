import { View } from "react-native";
import { useGridItemWidth } from "@/features/common/hooks/list/use-grid-item-width";
import { PosterTile } from "@/features/taste/elements/poster-tile";
import { Title } from "@/features/taste/data/dto/journey.dto";
import { PAGE_SIZE } from "@/features/taste/state";
import { tailwind } from "@/lib/tailwind";
import { Button } from "@/features/common/ui/button";

const COLUMNS = 2;
const GAP = Number(tailwind.theme.gap["2"]);
const HORIZONTAL_PADDING = Number(tailwind.theme.padding["4"]) * 2;

type Props = {
  items: Title[];
  shown: number;
  selected: number[];
  onToggle: (tmdbId: number) => void;
  onShowMore: () => void;
};

export const PosterGrid = ({
  items,
  shown,
  selected,
  onToggle,
  onShowMore,
}: Props) => {
  const { itemWidth } = useGridItemWidth({
    numColumns: COLUMNS,
    gap: GAP,
    horizontalPadding: HORIZONTAL_PADDING,
  });

  const visible = items.slice(0, shown);
  const remaining = items.length - shown;
  const showMoreCount = Math.min(PAGE_SIZE, remaining);

  return (
    <View className={"flex flex-col gap-4"}>
      <View className={"flex flex-row flex-wrap"} style={{ gap: GAP }}>
        {visible.map((item) => (
          <PosterTile
            key={item.tmdbId}
            item={item}
            width={itemWidth}
            selected={selected.includes(item.tmdbId)}
            onToggle={onToggle}
          />
        ))}
      </View>

      {remaining > 0 && (
        <Button
          variant={"black"}
          size={"md"}
          onPress={onShowMore}
        >{`Show ${showMoreCount} more`}</Button>
      )}
    </View>
  );
};
