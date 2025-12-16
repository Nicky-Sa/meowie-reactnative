import { Text, View } from "react-native";
import { Image } from "expo-image";
import { SkeletonItem } from "@/features/common/skeleton-item";
import { useFetchPersonInfo } from "@/features/movies/deep-dive/data/person/useFetchPersonInfo";

type Props = {
  personId: number;
};
export const Person = ({ personId }: Props) => {
  const { data, isLoading } = useFetchPersonInfo(personId);
  const isSkeletonData = personId === -1;

  return isLoading || !data || isSkeletonData ? (
    <PersonSkeleton />
  ) : (
    <View className={"flex flex-row items-center gap-3"}>
      <Image
        source={data.profilePath}
        style={{
          width: 80,
          height: 80,
          borderRadius: 9999,
        }}
        contentFit="cover"
        placeholder={{
          blurhash: "L5H2ECof00I04xayj[a{00aef6Rj",
          width: 100,
          height: 150,
        }}
      />
      <View className={"flex flex-col gap-1"}>
        <Text className={"title-t2-strong text-neutral-10-default"}>
          {data.name}
        </Text>
        <Text className={"body-b2 text-neutral-6-default"}>
          Known for: {data.knownForDepartment}
        </Text>
      </View>
    </View>
  );
};

const PersonSkeleton = () => {
  return (
    <View className={"flex flex-row items-center justify-start gap-3"}>
      <SkeletonItem className={"h-20 w-20 rounded-full"} />
      <View className={"flex w-44 flex-col items-start justify-start gap-1"}>
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-5"} />
      </View>
    </View>
  );
};
