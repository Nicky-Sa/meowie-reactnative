import { useEffect, useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import type { BottomTabNavigationProp } from "expo-router/js-tabs";
import { RootTabParamList } from "@/features/general/navbar/types";
import { useScrollToTop } from "expo-router/react-navigation";

export const useListRef = <T>() => {
  const listRef = useRef<FlashListRef<T>>(null);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  useScrollToTop(listRef);

  useEffect(() => {
    return navigation.addListener("tabPress", () => {
      // Tapping the tab you're already on scrolls back to the top.
      if (navigation.isFocused()) {
        listRef.current?.scrollToTop();
      }
    });
  }, [navigation]);

  return listRef;
};
