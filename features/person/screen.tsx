import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useScrollHandler } from "@/features/movies/hooks/useScrollHandler";
import { useLocalSearchParams } from "expo-router";
import { useFetchPersonInfo } from "@/features/person/data/useFetchPersonInfo";
import { PersonBrief } from "@/features/person/elements/brief";
import { PostersList } from "@/features/browse/elements/posters-list";

const NUM_COLUMNS = 3;

export const Screen = () => {
  const { personId } = useLocalSearchParams<{
    personId: string;
  }>();
  const searchParams = { personId };

  const { scrollHandler, scrollY } = useScrollHandler();

  const { data: personData, isLoading: personInfoLoading } =
    useFetchPersonInfo(personId);

  return (
    <InnerScreen
      title={personData?.name}
      scrollY={scrollY}
      fullHeight
      fullWidth
    >
      <PostersList
        moviesListTitle={personData?.name}
        numColumns={NUM_COLUMNS}
        searchParams={searchParams}
        scrollHandler={scrollHandler}
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
