import { View } from "react-native";
import { memo } from "react";
import { ID } from "@/features/common/data/query";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { MovieDetails } from "@/features/common/movies-list/details/movie-details";

type Props = {
  movieId: ID;
  shouldPlay: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const MoviesListItem = memo(
  ({ movieId, shouldPlay, index, scrollY }: Props) => {
    const contentStyle = useMainScreenContentStyle();
    const { height } = contentStyle;

    // Animated styles for scaling and opacity
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * height,
        index * height,
        (index + 1) * height,
      ];

      const scale = interpolate(
        scrollY.value,
        inputRange,
        [1.2, 1, 0.8], // Scale down as you scroll away
      );

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        [0.1, 1, 0.1], // Fade out as you scroll away
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });
    return (
      <Animated.View style={[animatedStyle]} className={"w-full"}>
        <View style={contentStyle}>
          <MovieDetails movieId={movieId} shouldPlay={shouldPlay} />
        </View>
      </Animated.View>
    );
  },
);

MoviesListItem.displayName = "MoviesListItem";
