import { useEffect, useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "@/features/general/navbar/types";
import { useScrollToTop } from "@react-navigation/native";

export const useListRef = (resetDependency?: unknown) => {
  const listRef = useRef<FlashListRef<number>>(null);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  useScrollToTop(listRef);

  useEffect(() => {
    return navigation.addListener("tabPress", () => {
      // Only scroll to top if already focused
      const isFocused = navigation.isFocused();
      if (isFocused) {
        listRef.current?.scrollToTop();
      }
    });
  }, [navigation]);

  // Scroll to top immediately when the dependency changes
  useEffect(() => {
    if (resetDependency !== undefined) {
      // animated: false is better to feel instant
      listRef.current?.scrollToTop({ animated: false });
    }
  }, [resetDependency]);

  return listRef;
};
