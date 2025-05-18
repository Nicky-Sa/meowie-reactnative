import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useContentScreenSize = () => {
  const insets = useSafeAreaInsets();

  const { height: h, width: w } = useWindowDimensions();
  return {
    height: h + (Platform.select({ android: insets.top, ios: 0 }) ?? 0),
    width: w,
  };
};

export const useRenderScrollIndicator = (currentIndex: number) => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("first-scroll-done").then((value) => {
      if (value === null) {
        if (currentIndex === 0) {
          setRender(true);
        } else {
          AsyncStorage.setItem("first-scroll-done", "true").then(() => {
            setRender(false);
          });
        }
      }
    });
  }, [currentIndex]);

  return render;
};
