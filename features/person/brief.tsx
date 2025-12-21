import { Text, View } from "react-native";
import { Image } from "expo-image";
import { SkeletonItem } from "@/features/common/skeleton-item";
import { cn } from "@/lib/tailwind";
import { PersonResDto } from "@/features/movies/deep-dive/data/person/person.dto";

type Props = {
  data: PersonResDto | undefined;
  isLoading: boolean;
  size: "lg" | "md";
};

const personBriefSizes = {
  lg: {
    imageWidth: 80,
    nameClassName: "title-t2-strong",
  },
  md: {
    imageWidth: 56,
    nameClassName: "body-b1",
  },
};

export const PersonBrief = ({ data, isLoading, size }: Props) => {
  return isLoading || !data ? (
    <PersonBriefSkeleton size={size} />
  ) : (
    <View className={"flex flex-row items-center gap-3"}>
      <Image
        source={data.profilePath}
        style={{
          width: personBriefSizes[size].imageWidth,
          aspectRatio: 1,
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
        <Text
          className={cn(
            personBriefSizes[size].nameClassName,
            "text-neutral-10-default",
          )}
        >
          {data.name}
        </Text>
        <Text className={"body-b2 text-neutral-6-default"}>
          Known for: {data.knownForDepartment}
        </Text>
      </View>
    </View>
  );
};

const PersonBriefSkeleton = ({ size }: Pick<Props, "size">) => {
  return (
    <View className={"flex flex-row items-center justify-start gap-3"}>
      <SkeletonItem
        className={cn("rounded-full", {
          "h-20 w-20": size === "lg",
          "h-14 w-14": size === "md",
        })}
      />
      <View className={"flex w-44 flex-col items-start justify-start gap-1"}>
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-5"} />
      </View>
    </View>
  );
};
