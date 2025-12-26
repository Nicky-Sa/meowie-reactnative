import { View } from "react-native";
import { SkeletonItem } from "@/features/common/skeleton-item";
import { cn } from "@/lib/tailwind";
import { PersonResDto } from "@/features/person/data/person.dto";
import { Brief } from "@/features/common/brief";

type Props = {
  data: PersonResDto | undefined;
  isLoading: boolean;
  size: "lg" | "md";
};

export const PersonBrief = ({ data, isLoading, size }: Props) => {
  return isLoading || !data ? (
    <PersonBriefSkeleton size={size} />
  ) : (
    <Brief
      imageUrl={data.profilePath}
      firstLine={data.name}
      secondLine={`known for ${data.knownForDepartment}`}
      size={size}
    />
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
