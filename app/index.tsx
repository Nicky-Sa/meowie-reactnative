import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useFetchMoviesIdList } from "@/hooks/TMDB/useFetchMoviesIdList";
import { Details } from "@/components/videoDetails/Details";
import { MainBg } from "@/components/ui/MainBg";
import { useWindowDimensions, View } from "react-native";
import Rive from "rive-react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const TMDB_DATA_LIMIT = 20;

export default function Movies() {
  const { data, setSize, size } = useFetchMoviesIdList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0); // Track scroll position
  const [color, setColor] = useState("#000000");
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, layoutMeasurement } = event;
      const progress = contentOffset.y / layoutMeasurement.height;
      scrollY.value = contentOffset.y; // Update shared value
      const activeIndex = Math.floor(progress);

      runOnJS(setCurrentIndex)(activeIndex);

      // Trigger load more when near the bottom
      if (
        contentOffset.y + layoutMeasurement.height >=
        layoutMeasurement.height * (data.length - 1)
      ) {
        runOnJS(setSize)(Math.floor((currentIndex + 2) / TMDB_DATA_LIMIT) + 1);
      }
    },
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className={"flex-1"}>
        <MainBg color={`${color}`}>
          <View
            className={"absolute z-10 w-full flex-1 items-start px-2 bg-red-300"}
            style={{
              marginTop: insets.top,
              height: insets.top + 24,
            }}
          >
            <Rive
              url="https://meowie-public.s3.eu-central-1.amazonaws.com/Meowie-logo.riv"
              style={{
                width: "40%",
                height: "100%",
              }}
            />
          </View>
          <Animated.ScrollView
            pagingEnabled
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            showsVerticalScrollIndicator={false}
          >
            {data.map((id, index) => (
              <Details
                key={index}
                id={id}
                setColor={setColor}
                shouldPlay={index === currentIndex}
                shouldFetch={
                  index === currentIndex || index === currentIndex + 1
                }
                index={index}
                scrollY={scrollY}
              />
            ))}
          </Animated.ScrollView>
        </MainBg>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
