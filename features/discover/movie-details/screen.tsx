import { InnerScreen } from "@/features/common/layout/inner-screen";
import { MovieDetails } from "@/features/common/movies-list/details/movie-details";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export const Screen = () => {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  return (
    <InnerScreen title={"Movie Details"}>
      <View className={"flex-1 items-center justify-center"}>
        <MovieDetails movieId={movieId} inScreen />
      </View>
    </InnerScreen>
  );
};
