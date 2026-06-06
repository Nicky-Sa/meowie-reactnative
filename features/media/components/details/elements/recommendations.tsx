import { View, Text, ScrollView } from "react-native";
import { Poster } from "@/features/common/posters/poster";
import { useRouter } from "expo-router";
import { Icon } from "@/features/common/ui/icon";
import { NavArrowRight } from "iconoir-react-native";
import { MediaType } from "@/features/common/data/models/media-type";
import { Button } from "@/features/common/ui/button";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";

type Props = {
  title: string;
  mediaId: number;
  mediaType: MediaType;
};

export const Recommendations = ({ title, mediaId, mediaType }: Props) => {
  const router = useRouter();
  const { media } = useAnalytics();
  const { data: results } = useFetchPosters(
    `/${mediaType}/${mediaId}/recommendations/posters`,
  );

  if (!results || results.length === 0) return null;

  const displayResults = results.slice(0, 5);

  const onSeeMore = () => {
    media.trackSeeMoreRecommendations({ mediaId, mediaType });
    router.push({
      pathname: "/discover/posters",
      params: {
        title: `More like ${title}`,
        endpoint: `/${mediaType}/${mediaId}/recommendations/posters`,
      },
    });
  };

  return (
    <View className={"flex flex-col gap-4"}>
      <View className={"flex flex-row items-center justify-between pl-4 pr-1"}>
        <Text className={"title-t2 text-neutral-10-default"}>
          More like this
        </Text>
        <Button
          variant={"link"}
          size={"md"}
          onPress={onSeeMore}
          icon={<Icon i={NavArrowRight} />}
          iconPosition={"right"}
        >
          See more
        </Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={"px-4 gap-3"}
      >
        {displayResults.map((item) => (
          <Poster
            key={item.id}
            data={item}
            width={140}
            isRounded
            showExtraDetails
            onPress={() =>
              router.push({
                pathname:
                  item.mediaType === "movie"
                    ? "/movie/[id]/details"
                    : "/series/[id]/details",
                params: { id: item.id.toString() },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};
