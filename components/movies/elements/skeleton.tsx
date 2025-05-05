import { View } from "react-native";
import { Bento } from "@/components/common/bento";
import { useContentScreenSize } from "@/components/movies/elements/hooks";

export const MoviesSkeleton = () => {
  const { height } = useContentScreenSize();

  return (
    <View className={"w-full flex-1 justify-end"}>
      <View
        style={{
          height: height * 0.9,
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
