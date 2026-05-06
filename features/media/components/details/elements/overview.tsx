import { useState, useCallback, useEffect } from "react";
import { Text, TextLayoutEvent, View, Pressable } from "react-native";
import { Button } from "@/features/common/ui/button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Props = {
  overview: string;
  mediaId: ID;
  mediaType: MediaType;
};

export const Overview = ({ overview, mediaId, mediaType }: Props) => {
  const { media } = useAnalytics();
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  const animatedHeight = useSharedValue<number | null>(null);
  const moreOpacity = useSharedValue(1);

  useEffect(() => {
    setExpanded(false);
    setShowMore(false);
    moreOpacity.value = 1;
    animatedHeight.value = null;
  }, [overview, moreOpacity, animatedHeight]);

  const onTextLayout = useCallback(
    (e: TextLayoutEvent) => {
      const lines = e.nativeEvent.lines;
      if (lines.length >= 5 && !expanded) {
        setShowMore(true);
        const collapsed = lines[4].y + lines[4].height;
        if (animatedHeight.value === null) {
          animatedHeight.value = collapsed;
        }
      }
    },
    [expanded, animatedHeight],
  );

  const onFullTextLayout = useCallback((e: TextLayoutEvent) => {
    const lines = e.nativeEvent.lines;
    const full = lines[lines.length - 1].y + lines[lines.length - 1].height;
    setFullHeight(full);
  }, []);

  const handleExpand = () => {
    if (expanded || fullHeight === 0) return;

    media.trackDescriptionExpanded({ mediaId, mediaType });
    setExpanded(true);
    animatedHeight.value = withTiming(fullHeight, { duration: 300 });
    moreOpacity.value = withTiming(0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value ?? "auto",
      overflow: "hidden",
    };
  });

  const moreButtonStyle = useAnimatedStyle(() => ({
    opacity: moreOpacity.value,
  }));

  return (
    <View>
      {/* Hidden text to measure full height */}
      <Text
        onTextLayout={onFullTextLayout}
        className={"body-b2 absolute opacity-0"}
        pointerEvents="none"
      >
        {overview}
      </Text>

      <Animated.View style={animatedStyle}>
        <Pressable onPress={handleExpand}>
          <Text
            numberOfLines={expanded ? undefined : 5}
            onTextLayout={onTextLayout}
            className={"body-b2 text-neutral-6-default"}
          >
            {overview}
          </Text>
        </Pressable>
      </Animated.View>

      {showMore && (
        <Animated.View
          style={moreButtonStyle}
          className={"absolute bottom-0 right-0 bg-neutral-15-default pl-1"}
          pointerEvents={expanded ? "none" : "auto"}
        >
          <Button
            variant={"link"}
            size={"unset"}
            onPress={handleExpand}
            haptic={false}
          >
            <Text className={"body-b2-strong text-neutral-10-default"}>
              {"... More"}
            </Text>
          </Button>
        </Animated.View>
      )}
    </View>
  );
};
