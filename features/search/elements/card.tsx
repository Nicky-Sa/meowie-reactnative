import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { PersonCard } from "@/features/search/elements/items/person";
import { MovieCard } from "@/features/search/elements/items/movie";
import { GenreCard } from "@/features/search/elements/items/genre";

type Props = {
  item: MultiSearchResults;
};

export const SearchResultCard = ({ item }: Props) => {
  switch (item.mediaType) {
    case "person":
      return <PersonCard item={item} />;
    case "movie":
      return <MovieCard item={item} />;
    case "movie-genre":
    case "series-genre":
      return <GenreCard item={item} />;
    default:
      return null;
  }
};
