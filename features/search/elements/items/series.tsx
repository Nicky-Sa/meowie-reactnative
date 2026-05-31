import { SearchResultSeries } from "@/features/search/data/models/search-result";
import { SeriesBrief } from "@/features/media/series/series-brief";
import { Link } from "@/features/common/ui/link";

type Props = {
  item: SearchResultSeries;
};

export const SeriesCard = ({ item }: Props) => {
  return (
    <Link
      href={{
        pathname: "/series/[id]/details",
        params: { id: item.id.toString() },
      }}
    >
      <SeriesBrief data={item} />
    </Link>
  );
};
