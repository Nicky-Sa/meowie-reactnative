import { SearchResultTv } from "@/features/search/data/models/search-result";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { TvBrief } from "@/features/media/tv/tv-brief";

type Props = {
  item: SearchResultTv;
};

export const TvCard = ({ item }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.push({
      pathname: "/discover/tv-details",
      params: { tvId: item.id },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <TvBrief data={item} />
    </Pressable>
  );
};
