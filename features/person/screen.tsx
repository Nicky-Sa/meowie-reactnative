import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { useFetchPersonInfo } from "@/features/person/data/useFetchPersonInfo";
import { PersonBrief } from "@/features/person/elements/brief";
import { PostersList } from "@/features/common/posters/posters-list";
import { useCallback } from "react";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { PersonEmptyState } from "@/features/person/elements/empty-state";

const NUM_COLUMNS = 3;

export const Screen = ({ personId }: { personId: string }) => {
  const { scrollHandler, scrollY } = useScrollHandler();

  const { data: personData, isLoading: personInfoLoading } =
    useFetchPersonInfo(personId);

  const posterData = useFetchPosters(`/person/${personId}/posters`, {
    personId,
  });

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/person/[id]/media",
        params: {
          id: personId,
          initialIndex: index.toString(),
          title: personData?.name ?? "",
        },
      });
    },
    [router, personData?.name, personId],
  );

  return (
    <InnerScreen
      title={personData?.name}
      scrollY={scrollY}
      titleFadeRange={[20, 100]}
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
        ListEmptyComponent={<PersonEmptyState />}
      />
    </InnerScreen>
  );
};
