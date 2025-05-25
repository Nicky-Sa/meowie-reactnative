import { useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useMovieContentHeight = () => {
  const { height: h } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  return {
    movieContentHeight: h - (top + 50),
  };
};

export const useRenderScrollIndicator = (currentIndex: number) => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("first-scroll-done").then((value) => {
      if (value === null && currentIndex >= 0) {
        if (currentIndex < 2) {
          setRender(true);
          if (currentIndex === 1) {
            AsyncStorage.setItem("first-scroll-done", "true");
          }
        } else {
          setRender(false);
        }
      }
    });
  }, [currentIndex]);

  return render;
};
