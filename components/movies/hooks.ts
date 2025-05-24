import { useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useContentScreenSize = () => {
  const { height: h, width: w } = useWindowDimensions();
  return {
    height: h,
    width: w,
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
