import { InnerScreen } from "@/features/common/layout/inner-screen";
import { MovieInfo } from "@/features/media/movie/info/movie-info";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export const Screen = () => {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  return (
    <InnerScreen title={"Movie Info"}>
      <View className={"flex-1 items-center justify-center"}>
        <MovieInfo movieId={movieId} inScreen />
      </View>
    </InnerScreen>
  );
};
