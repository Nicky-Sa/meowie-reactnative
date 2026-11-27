import { View } from "react-native";
import { memo, useEffect } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useMainScreenContentHeight } from "@/features/common/hooks/use-main-screen-content-style";
import { MovieInfo } from "@/features/media/movie/info/movie-info";
import { SeriesInfo } from "@/features/media/series/info/series-info";
import { MediaListItemData } from "@/features/media/components/list/types";
import { ShareTasteCard } from "@/features/taste/share-taste-card/share-taste-card";
import { currentRoleInMediaAtom } from "@/atoms";
import { useSetAtom } from "jotai";

type Props = {
  item: MediaListItemData;
  inScreen: boolean;
  index: number;
  scrollY: SharedValue<number>;
};

export const MediaListItem = memo(
  ({ item, inScreen, index, scrollY }: Props) => {
    const itemHeight = useMainScreenContentHeight();
    const { id, mediaType, roleInMedia, tag } = item;
    const setCurrentRoleInMedia = useSetAtom(currentRoleInMediaAtom);

    useEffect(() => {
      if (inScreen && roleInMedia) {
        setCurrentRoleInMedia(roleInMedia);
      }
    }, [inScreen, roleInMedia, setCurrentRoleInMedia]);

    // Animated styles for scaling and opacity
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * itemHeight,
        index * itemHeight,
        (index + 1) * itemHeight,
      ];

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        // Not 0: a trailer that becomes fully see-through loses its sound
        [0.0005, 1, 0.0005],
      );

      return {
        opacity,
      };
    });
    return (
      <Animated.View style={[animatedStyle]} className={"w-full"}>
        <View
          style={{ height: itemHeight }}
          className={"flex items-center justify-center"}
        >
          {item.card === "share-taste" ? (
            <ShareTasteCard mediaType={mediaType} inScreen={inScreen} />
          ) : mediaType === "movie" ? (
            <MovieInfo
              movieId={id}
              inScreen={inScreen}
              tag={tag}
              tourEnabled={index === 0} // first item
            />
          ) : mediaType === "series" ? (
            <SeriesInfo seriesId={id} inScreen={inScreen} tag={tag} />
          ) : null}
        </View>
      </Animated.View>
    );
  },
);

MediaListItem.displayName = "MediaListItem";
