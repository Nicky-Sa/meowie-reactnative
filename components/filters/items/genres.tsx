import { FilterItemWrapper } from "@/components/filters/elements/wrapper";
import { View } from "react-native";
import { Selectable } from "@/components/filters/elements/selectable";

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
];

export const Genres = () => {
  return (
    <FilterItemWrapper title={"Genres"}>
      <View className={"flex flex-row flex-wrap gap-2"}>
        {genres.map((genre) => (
          <Selectable key={genre} item={genre} filterKey={"genres"} multiple />
        ))}
      </View>
    </FilterItemWrapper>
  );
};
