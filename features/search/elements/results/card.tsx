import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { Card as PersonCard } from "@/features/search/elements/results/person/card";
import { Card as MovieCard } from "@/features/search/elements/results/movie/card";
import { Card as GenreCard } from "@/features/search/elements/results/genre/card";

type Props = {
  item: MultiSearchResults;
};

export const Card = ({ item }: Props) => {
  switch (item.mediaType) {
    case "person":
      return <PersonCard item={item} />;
    case "movie":
      return <MovieCard item={item} />;
    case "genre":
      return <GenreCard item={item} />;
    default:
      return null;
  }
};
