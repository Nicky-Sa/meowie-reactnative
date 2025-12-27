import { BottomSheetWrapper } from "@/features/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/ui/segment";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useGenres } from "@/features/general/data/constants/useGenres";
import { useMemo } from "react";

export const Genres = () => {
  const [filters] = useAtom(filtersAtom);
  const { data: rawGenres } = useGenres();

  const genres: SegmentItem[] | undefined = useMemo(
    () =>
      rawGenres?.map((genre) => ({
        id: String(genre.id),
        label: `${genre.emoji} ${genre.name}`,
      })),
    [rawGenres],
  );

  if (!genres) return null;

  return (
    <BottomSheetWrapper
      title={"Genres"}
      filterKey={"genres"}
      chipText={
        filters.genres.length === 1
          ? `${genres.find((genre) => String(genre.id) === filters.genres[0])?.label}`
          : `${filters.genres.length}`
      }
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-col gap-2">
            {genres.map((genre) => (
              <Segment
                key={genre.id}
                item={genre}
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                multiple
              />
            ))}
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetWrapper>
  );
};
