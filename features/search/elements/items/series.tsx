import { SearchResultSeries } from "@/features/search/data/models/search-result";
import { SeriesBrief } from "@/features/media/series/series-brief";
import { Link } from "@/features/common/ui/link";

type Props = {
  item: SearchResultSeries;
  onPress?: () => void;
};

export const SeriesCard = ({ item, onPress }: Props) => {
  return (
    <Link
      onPress={onPress}
      href={{
        pathname: "/series/[id]/details",
        params: { id: item.id.toString() },
      }}
    >
      <SeriesBrief data={item} />
    </Link>
  );
};
