import SwipeScreen from "@/components/video-details/SwipeScreen";
import { TrailerPlayer } from "@/components/video-details/TrailerPlayer";
import { generateRandomColors } from "@/lib/utils";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  const [screens, setScreens] = useState(() =>
    Array.from({ length: 5 }, () => ({
      id: generateRandomId(),
      backgroundColor: generateRandomColors(1)[0],
    })),
  );

  const loadMoreScreens = useCallback(() => {
    setScreens((prev) => [
      ...prev,
      ...Array.from({ length: 3 }, () => ({
        id: generateRandomId(),
        backgroundColor: generateRandomColors(1)[0],
      })),
    ]);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement, contentSize } = event;
      if (
        contentOffset.y + layoutMeasurement.height >=
        contentSize.height - layoutMeasurement.height
      ) {
        runOnJS(loadMoreScreens)();
      }
    },
  });

  return (
    <GestureHandlerRootView className={"flex-1"}>
      <Animated.ScrollView
        pagingEnabled
        scrollEventThrottle={16}
        // onScroll={scrollHandler}
        showsVerticalScrollIndicator={true}
      >
        {screens.map((screen) => (
          <TrailerPlayer
            key={screen.id}
            YTKey={screen.id}
            // backgroundColor={screen.backgroundColor}
          />
        ))}
      </Animated.ScrollView>
    </GestureHandlerRootView>
  );
}
