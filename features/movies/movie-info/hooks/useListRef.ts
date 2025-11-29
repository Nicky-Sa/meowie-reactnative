import { useEffect, useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "@/features/general/navbar/types";
import { useScrollToTop } from "@react-navigation/native";

export const useListRef = () => {
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

  return listRef;
};
