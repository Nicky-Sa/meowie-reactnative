import { SearchResultMovie } from "@/features/search/data/models/search-result";
import { Pressable } from "react-native";
import { MovieBrief } from "@/features/common/movies-list/details/elements/brief";
import { useRouter } from "expo-router";

type Props = {
  item: SearchResultMovie;
};

export const MovieCard = ({ item }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.push({
      pathname: "/discover/movie-details",
      params: { movieId: item.id },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <MovieBrief data={item} />
    </Pressable>
  );
};
