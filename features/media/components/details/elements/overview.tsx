import { useState, useCallback } from "react";
import { Text, TextLayoutEvent, View, Pressable } from "react-native";
import { Button } from "@/features/common/ui/button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type Props = {
  overview: string;
};

export const Overview = ({ overview }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  const animatedHeight = useSharedValue<number | null>(null);

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
    animatedHeight.value = withTiming(fullHeight, { duration: 300 }, () => {
      scheduleOnRN(setExpanded, true);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value ?? "auto",
      overflow: "hidden",
    };
  });

  return (
    <View>
      {/* Hidden text to measure full height */}
      <Text
        onTextLayout={onFullTextLayout}
        className={"body-b2 absolute opacity-0"}
        style={{ lineHeight: 22 }}
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
            style={{ lineHeight: 22 }}
          >
            {overview}
          </Text>
        </Pressable>
      </Animated.View>

      {showMore && !expanded && (
        <View
          className={"absolute bottom-0 right-0 bg-neutral-15-default pl-1"}
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
        </View>
      )}
    </View>
  );
};
