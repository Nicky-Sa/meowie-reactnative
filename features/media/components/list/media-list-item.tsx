import { View } from "react-native";
import { memo } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { MovieDetails } from "@/features/media/movie/movie-details";
import { TvDetails } from "@/features/media/tv/tv-details";
import { MediaListItemData } from "@/features/media/components/list/types";

type Props = {
  item: MediaListItemData;
  inScreen: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const MediaListItem = memo(
  ({ item, inScreen, index, scrollY }: Props) => {
    const contentStyle = useMainScreenContentStyle();
    const { height } = contentStyle;
    const { id, mediaType } = item;

    // Animated styles for scaling and opacity
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * height,
        index * height,
        (index + 1) * height,
      ];

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        [0.1, 1, 0.1], // Fade out as you scroll away
      );

      return {
        opacity,
      };
    });
    return (
      <Animated.View style={[animatedStyle]} className={"w-full"}>
        <View
          style={contentStyle}
          className={"flex items-center justify-center"}
        >
          {mediaType === "movie" ? (
            <MovieDetails movieId={id} inScreen={inScreen} />
          ) : mediaType === "tv" ? (
            <TvDetails tvId={id} inScreen={inScreen} />
          ) : null}
        </View>
      </Animated.View>
    );
  },
);

MediaListItem.displayName = "MediaListItem";
