import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { Selectable } from "@/components/filters/elements/selectable";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { useImmer } from "use-immer";

const genres = [
  "💥 Action",
  "🏕️ Adventure",
  "🐭 Animation",
  "😂 Comedy",
  "🕵️‍♂️ Crime",
  "📜 Documentary",
  "💔 Drama",
  "🏡 Family",
  "🧙‍♂️ Fantasy",
  "🏛️ History",
  "👻 Horror",
  "🎸 Music",
  "🧚‍♀️ Mystery",
  "💖 Romance",
  "👽 Science Fiction",
  "📺 TV Movie",
  "🤯 Thriller",
  "⚔️ War",
  "🤠 Western",
];

export const Genres = () => {
  const [filters] = useAtom(filtersAtom);
  const [currentValues, setCurrentValues] = useImmer(filters.genres);

  return (
    <BottomSheetWrapper
      title={"Genres"}
      filterKey={"genres"}
      currentValues={currentValues}
      setCurrentValues={setCurrentValues}
      chipText={
        filters.genres.length === 1
          ? `${filters.genres[0]}`
          : `${filters.genres.length}`
      }
    >
      <View className={"flex flex-row flex-wrap gap-2"}>
        {genres.map((genre) => (
          <Selectable
            key={genre}
            item={genre}
            currentValues={currentValues}
            setCurrentValues={setCurrentValues}
            multiple
          />
        ))}
      </View>
    </BottomSheetWrapper>
  );
};
