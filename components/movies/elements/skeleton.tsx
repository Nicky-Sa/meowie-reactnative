import { View } from "react-native";
import { useMovieContentStyle } from "@/components/movies/hooks";
import { cn } from "@/lib/utils";

export const MoviesSkeleton = () => {
  const contentStyle = useMovieContentStyle();

  return (
    <View className={"w-full flex-1 justify-end"}>
      <View
        style={contentStyle}
        className={
          "flex w-full animate-pulse flex-col items-start justify-center gap-1.5 xs:gap-3"
        }
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
