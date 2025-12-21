import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { PersonResult } from "@/features/search/elements/result/person-result";
import { MovieResult } from "@/features/search/elements/result/movie-result";

type Props = {
  item: MultiSearchResults;
};

export const SearchResult = ({ item }: Props) => {
  switch (item.mediaType) {
    case "person":
      return <PersonResult item={item} />;
    case "movie":
      return <MovieResult item={item} />;
    default:
      return null;
  }
};
