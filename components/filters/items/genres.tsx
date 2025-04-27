import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import {
  FilterItem,
  Selectable,
} from "@/components/filters/elements/selectable";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const genres: FilterItem[] = [
  { id: "28", name: "💥 Action" },
  { id: "12", name: "🏕️ Adventure" },
  { id: "16", name: "🐭 Animation" },
  { id: "35", name: "😂 Comedy" },
  { id: "80", name: "🕵️‍♂️ Crime" },
  { id: "99", name: "📜 Documentary" },
  { id: "18", name: "💔 Drama" },
  { id: "10751", name: "🏡 Family" },
  { id: "14", name: "🧙‍♂️ Fantasy" },
  { id: "36", name: "🏛️ History" },
  { id: "27", name: "👻 Horror" },
  { id: "10402", name: "🎸 Music" },
  { id: "9648", name: "🧚‍♀️ Mystery" },
  { id: "10749", name: "💖 Romance" },
  { id: "878", name: "👽 Science Fiction" },
  { id: "10770", name: "📺 TV Movie" },
  { id: "53", name: "🤯 Thriller" },
  { id: "10752", name: "⚔️ War" },
  { id: "37", name: "🤠 Western" },
];

export const Genres = () => {
  const [filters] = useAtom(filtersAtom);

  return (
    <BottomSheetWrapper
      title={"Genres"}
      filterKey={"genres"}
      chipText={
        filters.genres.length === 1
          ? `${genres.find((genre) => genre.id === filters.genres[0])?.name}`
          : `${filters.genres.length}`
      }
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-row flex-wrap gap-2">
            {genres.map((genre) => (
              <Selectable
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
