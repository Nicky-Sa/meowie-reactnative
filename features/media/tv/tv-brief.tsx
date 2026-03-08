import { Image } from "expo-image";
import { Text, View } from "react-native";
import { SearchResultTv } from "@/features/search/data/models/search-result";

type Props = {
  data: SearchResultTv;
};

export const TvBrief = ({ data }: Props) => {
  return (
    <View className={"flex flex-row items-center gap-2"}>
      <Image
        source={data.posterPath}
        style={{
          width: 48,
          aspectRatio: 2 / 3,
          borderRadius: 8,
        }}
        contentFit="cover"
        placeholder={{
          blurhash: "L5H2ECof00I04xayj[a{00aef6Rj",
          width: 100,
          height: 150,
        }}
      />
      <View className={"flex flex-1 flex-col gap-1"}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={"body-b1 overflow-hidden text-neutral-10-default"}
        >
          {data.title}
        </Text>
        <View className={"flex flex-row items-center gap-3"}>
          <Text className={"body-b2 text-neutral-5-default"}>TV-Series</Text>
          <Text className={"body-b2 text-neutral-5-default"}>
            {data.firstAirDate}
          </Text>
        </View>
        <View className={"flex flex-row gap-3"}>
          {data.genres.slice(0, 3).map((genre) => (
            <Text key={genre} className={"body-b2 text-neutral-5-default"}>
              {genre}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};
