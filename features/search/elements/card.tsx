import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { PersonCard } from "@/features/search/elements/items/person";
import { MovieCard } from "@/features/search/elements/items/movie";
import { GenreCard } from "@/features/search/elements/items/genre";
import { SeriesCard } from "@/features/search/elements/items/series";

type Props = {
  item: MultiSearchResults;
  onPress?: () => void;
};

export const SearchResultCard = ({ item, onPress }: Props) => {
  switch (item.mediaType) {
    case "person":
      return <PersonCard item={item} onPress={onPress} />;
    case "movie":
      return <MovieCard item={item} onPress={onPress} />;
    case "series":
      return <SeriesCard item={item} onPress={onPress} />;
    case "movie-genre":
    case "series-genre":
      return <GenreCard item={item} onPress={onPress} />;
    default:
      return null;
  }
};
