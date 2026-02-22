import { BottomSheetWrapper } from "@/features/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/ui/segment";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useGenres } from "@/features/general/data/constants/useGenres";
import { useMemo } from "react";

export const MoviesGenres = () => {
  const [filters] = useAtom(filtersAtom);
  const { data } = useGenres();

  const movieGenres: SegmentItem[] = useMemo(() => {
    if (!data?.movieGenres) return [];
    return data.movieGenres.map((genre) => ({
      id: String(genre.id),
      label: `${genre.emoji} ${genre.name}`,
    }));
  }, [data]);

  if (!movieGenres.length) return null;

  return (
    <BottomSheetWrapper
      title={"MoviesGenres"}
      filterKey={"genres"}
      chipText={
        filters.genres.length === 1
          ? `${movieGenres.find((genre) => String(genre.id) === filters.genres[0])?.label}`
          : `${filters.genres.length}`
      }
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-col gap-6 pb-6">
            <View className="flex flex-col gap-2">
              {movieGenres.map((genre) => (
                <Segment
                  key={`movie-${genre.id}`}
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
