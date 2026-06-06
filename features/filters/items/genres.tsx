import { BottomSheetWrapper } from "@/features/filters/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/ui/segment";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Genre } from "@/features/general/data/constants/use-genres";
import { useMemo } from "react";

type Props = {
  genres: Genre[];
  value: string[];
  isClearable: boolean;
  onApply: (newVal: string[]) => void;
  onClear: () => void;
};

export const Genres = ({
  genres,
  value,
  isClearable,
  onApply,
  onClear,
}: Props) => {
  const activeGenres: SegmentItem[] = useMemo(() => {
    return genres.map((genre) => ({
      id: String(genre.id),
      label: `${genre.emoji} ${genre.name}`,
    }));
  }, [genres]);

  return (
    <BottomSheetWrapper
      title={"Genre"}
      chipText={
        value.length === 1
          ? `${activeGenres.find((genre) => String(genre.id) === value[0])?.label}`
          : `${value.length}`
      }
      value={value}
      isClearable={isClearable}
      onApply={onApply}
      onClear={onClear}
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-col gap-6 pb-6">
            <View className="flex flex-col gap-2">
              {activeGenres.map((genre) => (
                <Segment
                  key={`genre-${genre.id}`}
                  item={genre}
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  multiple
                />
              ))}
            </View>
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetWrapper>
  );
};
