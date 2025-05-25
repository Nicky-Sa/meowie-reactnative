import { View } from "react-native";
import { Bento } from "@/components/common/bento";
import { useMovieContentHeight } from "@/components/movies/hooks";

export const MoviesSkeleton = () => {
  const { movieContentHeight } = useMovieContentHeight();

  return (
    <View className={"w-full flex-1 justify-end"}>
      <View
        style={{
          height: movieContentHeight,
        }}
        className={
          "flex w-full animate-pulse flex-col items-start justify-center gap-1.5 xs:gap-3"
        }
      >
        <Bento>
          <View className={"h-14 w-full"} />
        </Bento>
        <Bento>
          <View className={"h-40 w-full"} />
        </Bento>
        <Bento>
          <View className={"h-16 w-full"} />
        </Bento>
        <Bento>
          <View className={"h-40 w-full"} />
        </Bento>
        <Bento>
          <View className={"h-16 w-full"} />
        </Bento>
      </View>
    </View>
  );
};
