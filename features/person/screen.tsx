import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useScrollHandler } from "@/features/browse/hooks/list/useScrollHandler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchPersonInfo } from "@/features/person/data/useFetchPersonInfo";
import { PersonBrief } from "@/features/person/elements/brief";
import { PostersList } from "@/features/browse/elements/posters-list";
import { useCallback } from "react";
import { PosterAPIDetails } from "@/features/browse/data/poster/type";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { personId } = useLocalSearchParams<{
    personId: string;
  }>();

  const { scrollHandler, scrollY } = useScrollHandler();

  const { data: personData, isLoading: personInfoLoading } =
    useFetchPersonInfo(personId);

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/browse/movies-list",
        params: {
          initialIndex: index,
          title: personData?.name,
          url: "/movies/poster",
          personId,
        },
      });
    },
    [router, personData?.name, personId],
  );

  const apiDetails: PosterAPIDetails = {
    url: "/movies/poster",
    queryParams: { personId },
  };

  return (
    <InnerScreen
      title={personData?.name}
      scrollY={scrollY}
      fullHeight
      fullWidth
    >
      <PostersList
        numColumns={NUM_COLUMNS}
        apiDetails={apiDetails}
        scrollHandler={scrollHandler}
        onPosterPress={onPosterPress}
        ListHeaderComponent={
          <View className={"px-4 pb-4"}>
            <PersonBrief
              data={personData}
              isLoading={personInfoLoading}
              size={"lg"}
            />
          </View>
        }
      />
    </InnerScreen>
  );
};
