import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { View } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { useFetchPersonInfo } from "@/features/movies/deep-dive/data/useFetchPersonInfo";
import {
  Person,
  PersonSkeleton,
} from "@/features/movies/deep-dive/elements/person";

type Props = {
  personId: number;
};

export const Content = ({ personId }: Props) => {
  const { data, dataLength, setSize, isLoading, error, mutate } =
    useFetchMoviesIds();

  const { data: personInfo, isLoading: personInfoLoading } =
    useFetchPersonInfo(personId);

  return (
    <InnerScreen title={"Person Movies"}>
      <View className={"flex w-full flex-1 flex-col gap-8"}>
        {personInfoLoading || !personInfo ? (
          <PersonSkeleton />
        ) : (
          <Person {...personInfo} />
        )}
      </View>
    </InnerScreen>
  );
};
