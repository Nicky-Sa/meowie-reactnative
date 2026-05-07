import { InnerScreen } from "@/features/common/layout/inner-screen";
import { MovieInfo } from "@/features/media/movie/info/movie-info";
import { View } from "react-native";

export const Screen = ({ id }: { id: string }) => {
  return (
    <InnerScreen title={"Movie Info"}>
      <View className={"flex-1 items-center justify-center"}>
        <MovieInfo movieId={id} inScreen />
      </View>
    </InnerScreen>
  );
};
