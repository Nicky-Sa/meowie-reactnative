import { SearchResultMovie } from "@/features/search/data/models/search-result";
import { MovieBrief } from "@/features/media/movie/movie-brief";
import { Link } from "@/features/common/ui/link";

type Props = {
  item: SearchResultMovie;
};

export const MovieCard = ({ item }: Props) => {
  return (
    <Link
      href={{
        pathname: "/movie/[id]/details",
        params: { id: item.id.toString() },
      }}
    >
      <MovieBrief data={item} />
    </Link>
  );
};
