import { View } from "react-native";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { MovieDetails } from "@/features/media/movie/movie-details";
import { SeriesDetails } from "@/features/media/series/series-details";
import { MediaListItemData } from "@/features/media/components/list/types";
import { currentRoleInMediaAtom } from "@/atoms";
import { useAtom } from "jotai";

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
    const { id, mediaType, roleInMedia } = item;
    const [, setCurrentRoleInMedia] = useAtom(currentRoleInMediaAtom);

    useEffect(() => {
      if (inScreen && roleInMedia) {
        setCurrentRoleInMedia(roleInMedia);
      }
    }, [inScreen, roleInMedia, setCurrentRoleInMedia]);

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
            <MovieDetails
              movieId={id}
              inScreen={inScreen}
              tourEnabled={index === 0} // first item
            />
          ) : mediaType === "series" ? (
            <SeriesDetails seriesId={id} inScreen={inScreen} />
          ) : null}
        </View>
      </Animated.View>
    );
  },
);

MediaListItem.displayName = "MediaListItem";
