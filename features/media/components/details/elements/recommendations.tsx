import { View, Text, ScrollView } from "react-native";
import { PosterResDto } from "@/features/common/posters/poster.dto";
import { Poster } from "@/features/common/posters/poster";

import { useRouter } from "expo-router";

type Props = {
  recommendations: PosterResDto;
};

export const Recommendations = ({ recommendations }: Props) => {
  const router = useRouter();

  if (!recommendations.results || recommendations.results.length === 0)
    return null;

  return (
    <View className={"flex flex-col gap-4"}>
      <Text className={"title-t2 px-4 text-neutral-10-default"}>
        More like this
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={"px-4 gap-3"}
      >
        {recommendations.results.map((item) => (
          <Poster
            key={item.id}
            data={item}
            width={140}
            onPress={() =>
              router.push({
                pathname:
                  item.mediaType === "movie"
                    ? "/discover/movie-details"
                    : "/discover/series-details",
                params:
                  item.mediaType === "movie"
                    ? { movieId: item.id }
                    : { seriesId: item.id },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};
