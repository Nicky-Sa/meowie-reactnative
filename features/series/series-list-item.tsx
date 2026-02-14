import { View } from "react-native";
import { memo } from "react";
import { ID } from "@/features/common/data/media-query";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { SeriesDetails } from "@/features/series/details/series-details";

type Props = {
  seriesId: ID;
  inScreen: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const SeriesListItem = memo(
  ({ seriesId, inScreen, index, scrollY }: Props) => {
    const contentStyle = useMainScreenContentStyle();
    const { height } = contentStyle;

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
          <SeriesDetails seriesId={seriesId} inScreen={inScreen} />
        </View>
      </Animated.View>
    );
  },
);

SeriesListItem.displayName = "SeriesListItem";
