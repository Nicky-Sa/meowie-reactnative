import { SearchResultSeries } from "@/features/search/data/models/search-result";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SeriesBrief } from "@/features/media/series/series-brief";

type Props = {
  item: SearchResultSeries;
};

export const SeriesCard = ({ item }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.push({
      pathname: "/discover/series-info",
      params: { seriesId: item.id },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <SeriesBrief data={item} />
    </Pressable>
  );
};
