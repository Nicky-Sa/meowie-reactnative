import { BottomSheetWrapper } from "@/features/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/segment";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const genres: SegmentItem[] = [
  { id: "28", label: "💥 Action" },
  { id: "12", label: "🏕️ Adventure" },
  { id: "16", label: "🐭 Animation" },
  { id: "35", label: "😂 Comedy" },
  { id: "80", label: "🕵️‍♂️ Crime" },
  { id: "99", label: "📜 Documentary" },
  { id: "18", label: "💔 Drama" },
  { id: "10751", label: "🏡 Family" },
  { id: "14", label: "🧙‍♂️ Fantasy" },
  { id: "36", label: "🏛️ History" },
  { id: "27", label: "👻 Horror" },
  { id: "10402", label: "🎸 Music" },
  { id: "9648", label: "🧚‍♀️ Mystery" },
  { id: "10749", label: "💖 Romance" },
  { id: "878", label: "👽 Science Fiction" },
  { id: "10770", label: "📺 TV Movie" },
  { id: "53", label: "🤯 Thriller" },
  { id: "10752", label: "⚔️ War" },
  { id: "37", label: "🤠 Western" },
];

export const Genres = () => {
  const [filters] = useAtom(filtersAtom);

  return (
    <BottomSheetWrapper
      title={"Genres"}
      filterKey={"genres"}
      chipText={
        filters.genres.length === 1
          ? `${genres.find((genre) => genre.id === filters.genres[0])?.label}`
          : `${filters.genres.length}`
      }
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-row flex-wrap gap-2">
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
