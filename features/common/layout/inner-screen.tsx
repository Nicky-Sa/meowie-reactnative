import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { NavArrowLeft } from "iconoir-react-native";
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "expo-router";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { cn } from "@/lib/tailwind";
import { Edges } from "react-native-safe-area-context/src/SafeArea.types";

type Props = {
  title?: string;
  subtitle?: string;
  scrolledTitle?: string;
  titleFadeRange?: [number, number];
  onBack?: () => void;
  rightTopComponent?: ReactNode;
  scrollY?: SharedValue<number>;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

export const InnerScreen = ({
  title,
  subtitle,
  scrolledTitle,
  titleFadeRange = [20, 100],
  onBack,
  rightTopComponent,
  scrollY,
  fullWidth,
  fullHeight,
  children,
}: PropsWithChildren<Props>) => {
  const router = useRouter();

  // 1. Store the latest onBack in a ref.
  // This allows us to access it inside useEffect cleanup without adding it to dependencies.
  const onBackRef = useRef(onBack);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  // 2. Run strictly on Unmount (Back/Pop)
  useEffect(() => {
    return () => {
      // This runs only when the component is destroyed (Back),
      // NOT when navigating forward (Push).
      onBackRef.current?.();
    };
  }, []);

  const handleBack = useCallback(() => {
    // We strictly invoke navigation here.
    // The onBack logic is now handled automatically by the useEffect cleanup above
    // which triggers when this router.back() causes the unmount.
    router.back();
  }, [router]);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 1 };

    // If we have a scrolledTitle, the primary title (e.g. "Movie Details")
    // should be visible at start and fade out as we scroll.
    if (scrolledTitle) {
      return {
        opacity: interpolate(scrollY.value, titleFadeRange, [1, 0], "clamp"),
      };
    }

    // Default behavior: title fades in
    const opacity = interpolate(scrollY.value, titleFadeRange, [0, 1], "clamp");

    return { opacity };
  });

  const scrolledTitleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || !scrolledTitle) return { opacity: 0 };

    // Scrolled title fades in as we scroll
    return {
      opacity: interpolate(scrollY.value, titleFadeRange, [0, 1], "clamp"),
    };
  });

  const edges = useMemo(
    () =>
      ["top", "bottom"].filter((edge) =>
        fullHeight ? edge !== "bottom" : true,
      ) as Edges,
    [fullHeight],
  );

  return (
    <SafeAreaView className={"flex-1"} edges={edges}>
      <View
        className={cn(
          "flex flex-1 flex-col justify-between gap-2",
          !fullWidth && "px-4",
        )}
      >
        <View
          className={cn(
            "flex flex-row items-center justify-between",
            !fullWidth && "-mx-4", // the fullWidth prop should have no effect on the back button
          )}
        >
          <View className={"flex flex-1 flex-row items-center justify-start"}>
            <Button
              onPress={handleBack}
              variant={"ghost"}
              size={"md"}
              iconPosition={"only"}
              icon={<Icon i={NavArrowLeft} />}
            />
            <View className={"relative flex-1 justify-center"}>
              <Animated.Text
                style={[titleAnimatedStyle]}
                className={"title-t2-strong text-neutral-10-default"}
                numberOfLines={1}
              >
                {title}
              </Animated.Text>
              {subtitle && (
                <Text
                  numberOfLines={1}
                  className={"body-b1 h-6 text-neutral-5-default"}
                >
                  {subtitle}
                </Text>
              )}
              {scrolledTitle && (
                <Animated.Text
                  style={[
                    scrolledTitleAnimatedStyle,
                    { position: "absolute", left: 0, right: 0 },
                  ]}
                  className={"title-t2-strong text-neutral-10-default"}
                  numberOfLines={1}
                >
                  {scrolledTitle}
                </Animated.Text>
              )}
            </View>
          </View>
          {rightTopComponent}
        </View>

        {children}
      </View>
    </SafeAreaView>
  );
};
