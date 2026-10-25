import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { cn, tailwind } from "@/lib/tailwind";

type Props = {
  items: string[];
  activeItem: string;
  setActiveItem: (item: string) => void;
  containerClassName?: string;
  tabClassName?: string;
};

export const SlidingToggle = ({
  items,
  activeItem,
  setActiveItem,
  containerClassName,
  tabClassName,
}: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeItem === items[0] ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeItem, slideAnim, items]);

  const tabWidth = containerWidth / 2;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  return (
    <View
      className={cn(
        "relative h-12 flex-row items-center rounded-full bg-neutral-14-default p-1",
        containerClassName,
      )}
      onLayout={(e: LayoutChangeEvent) =>
        setContainerWidth(
          e.nativeEvent.layout.width - Number(tailwind.theme.spacing[1]) * 2,
        )
      }
    >
      <Animated.View
        className={cn(
          "absolute bottom-1 left-1 top-1 w-1/2 rounded-full bg-neutral-10-default shadow-md",
          tabClassName,
        )}
        style={{ transform: [{ translateX }] }}
      />

      {items.map((item) => (
        <Pressable
          key={item}
          className="z-10 h-full flex-1 items-center justify-center"
          onPress={() => setActiveItem(item)}
        >
          <Text className={cn("body-b1-strong text-neutral-10-default")}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
