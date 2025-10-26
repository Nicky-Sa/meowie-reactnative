import { View } from "react-native";
import { useMovieContentStyle } from "@/features/movies/hooks";
import { cn } from "@/lib/utils";

export const MoviesSkeleton = () => {
  const contentStyle = useMovieContentStyle();

  return (
    <View className={"w-full flex-1 justify-start"}>
      <View
        className={
          "mx-4 flex animate-pulse flex-col items-start justify-start gap-4"
        }
        style={contentStyle}
      >
        <SkeletonItem className={"h-20"} />
        <SkeletonItem className={"h-48"} />
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-16"} />
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-8"} />
        <SkeletonItem className={"h-16"} />
      </View>
    </View>
  );
};

const SkeletonItem = ({ className }: { className: string }) => {
  return (
    <View
      className={cn(className, "w-full rounded-xl bg-neutral-11-default")}
    />
  );
};
