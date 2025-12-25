import { SearchResultMovie } from "@/features/search/data/models/search-result";
import { Pressable } from "react-native";
import { MovieBrief } from "@/features/movies/elements/brief";

type Props = {
  item: SearchResultMovie;
};

export const MovieCard = ({ item }: Props) => {
  return (
    <Pressable>
      <MovieBrief data={item} />
    </Pressable>
  );
};
