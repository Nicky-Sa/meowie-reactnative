import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchPersonInfo } from "@/features/person/data/useFetchPersonInfo";
import { PersonBrief } from "@/features/person/elements/brief";
import { PostersList } from "@/features/common/posters/posters-list";
import { useCallback } from "react";
import { useFetchMoviePosters } from "@/features/common/posters/useFetchMoviePosters";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { personId } = useLocalSearchParams<{
    personId: string;
  }>();

  const { scrollHandler, scrollY } = useScrollHandler();

  const { data: personData, isLoading: personInfoLoading } =
    useFetchPersonInfo(personId);

  const posterData = useFetchMoviePosters({ personId });

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/person/movies-list",
        params: {
          initialIndex: index,
          title: personData?.name,
          personId,
        },
      });
    },
    [router, personData?.name, personId],
  );

  return (
    <InnerScreen
      title={personData?.name}
      scrollY={scrollY}
      fullHeight
      fullWidth
    >
      <PostersList
        numColumns={NUM_COLUMNS}
        posterData={posterData}
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
