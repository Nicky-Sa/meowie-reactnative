import { View } from "react-native";
import { useMovieContentStyle } from "@/components/movies/hooks";
import { cn } from "@/lib/utils";

export const MoviesSkeleton = () => {
  const contentStyle = useMovieContentStyle();

  return (
    <View className={"w-full flex-1 justify-end"}>
      <View
        className={
          "mx-4 flex animate-pulse flex-col items-start justify-center gap-4"
        }
        style={contentStyle}
      >
        <SkeletonItem className={"h-16"} />
        <SkeletonItem className={"h-40"} />
        <SkeletonItem className={"h-16"} />
        <SkeletonItem className={"h-40"} />
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
