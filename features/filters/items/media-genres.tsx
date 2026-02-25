import { BottomSheetWrapper } from "@/features/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/ui/segment";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useGenres } from "@/features/general/data/constants/useGenres";
import { useMemo } from "react";
import { MediaType } from "@/features/common/data/models/media-type";

export const MediaGenres = ({ mediaType }: { mediaType: MediaType }) => {
  const [filters] = useAtom(filtersAtom);
  const { data } = useGenres();

  const activeGenres: SegmentItem[] = useMemo(() => {
    const genresData = mediaType === "tv" ? data?.tvGenres : data?.movieGenres;
    if (!genresData) return [];
    return genresData.map((genre) => ({
      id: String(genre.id),
      label: `${genre.emoji} ${genre.name}`,
    }));
  }, [data, mediaType]);

  if (!activeGenres.length) return null;

  return (
    <BottomSheetWrapper
      title={"Genre"}
      filterKey={"genres"}
      chipText={
        filters.genres.length === 1
          ? `${activeGenres.find((genre) => String(genre.id) === filters.genres[0])?.label}`
          : `${filters.genres.length}`
      }
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
