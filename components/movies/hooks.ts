import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";

export const useMovieContentStyle = () => {
  const { height } = useScreenDimensions();
  const { top, bottom } = useSafeAreaInsets();

  return {
    height,
    paddingTop: top + 50,
    paddingBottom: bottom,
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
      } else {
        setRender(false);
      }
    });
  }, [currentIndex]);

  return render;
};
