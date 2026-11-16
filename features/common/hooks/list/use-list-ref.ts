import { useEffect } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { useNavigation, useScrollToTop } from "expo-router";
import type { BottomTabNavigationProp } from "expo-router/js-tabs";
import { useAnimatedRef } from "react-native-reanimated";
import { RootTabParamList } from "@/features/general/navbar/types";

/** An animated ref, so worklets can scroll the list with Reanimated's `scrollTo`. */
export const useListRef = <T>() => {
  const listRef = useAnimatedRef<FlashListRef<T>>();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  useScrollToTop(listRef);

  useEffect(() => {
    return navigation.addListener("tabPress", () => {
      // Tapping the tab you're already on scrolls back to the top.
      if (navigation.isFocused()) {
        listRef.current?.scrollToTop();
      }
    });
  }, [navigation, listRef]);

  return listRef;
};
