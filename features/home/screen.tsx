import { MainScreen } from "@/features/common/layout/main-screen";
import { Header } from "@/features/home/header";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";
import { Content as MoviesContent } from "@/features/movies/content";
import { Content as SeriesContent } from "@/features/series/content";
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const items = ["Movies", "Series"];

export const Screen = () => {
  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler();
  const [activeMediaType, setActiveMediaType] = useState(items[0]);

  const { width: screenWidth } = useWindowDimensions();

  const translateX = useSharedValue(0);

  // Trigger Animation when tab changes
  useEffect(() => {
    const index = items.indexOf(activeMediaType);
    translateX.value = withTiming(-index * screenWidth, {
      duration: 300,
      easing: Easing.out(Easing.exp), // Smooth exponential easing
    });
  }, [activeMediaType, screenWidth, translateX]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <MainScreen>
      <Header
        scrollY={scrollY}
        mediaTypes={items}
        activeMediaType={activeMediaType}
        setActiveMediaType={setActiveMediaType}
      />

      {/* Sliding Container: Width = 200% of screen (for 2 tabs) */}
      <Animated.View
        className="flex-1 flex-row"
        style={[{ width: screenWidth * items.length }, slideStyle]}
      >
        {/* Tab 1: Movies */}
        <MoviesContent
          currentIndex={currentIndex}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
          onLoad={onLoad}
        />

        {/* Tab 2: Series */}
        <SeriesContent
          currentIndex={currentIndex}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
          onLoad={onLoad}
        />
      </Animated.View>
    </MainScreen>
  );
};
