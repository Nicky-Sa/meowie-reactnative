import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { NavArrowLeft } from "iconoir-react-native";
import { PropsWithChildren, ReactNode, useCallback, useMemo } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Edges } from "react-native-safe-area-context/src/SafeArea.types";

type Props = {
  title?: string;
  onBack?: () => void;
  rightTopComponent?: ReactNode;
  scrollY?: SharedValue<number>;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

export const InnerScreen = ({
  title,
  onBack,
  rightTopComponent,
  scrollY,
  fullWidth,
  fullHeight,
  children,
}: PropsWithChildren<Props>) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    onBack?.();
    router.back();
  }, [onBack, router]);

  // Run onBack when the screen is not focused anymore
  useFocusEffect(
    useCallback(() => {
      return onBack;
    }, [onBack]),
  );

  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 1 };

    const opacity = interpolate(scrollY.value, [20, 100], [0, 1], "clamp");

    return { opacity };
  });
  const edges = useMemo(
    () =>
      ["top", "left", "right", "bottom"].filter((edge) =>
        fullHeight ? edge !== "bottom" : true,
      ) as Edges,
    [fullHeight],
  );

  return (
    <View className={"flex-1 bg-neutral-15-default"}>
      <SafeAreaView edges={edges}>
        <View
          className={cn("flex h-full flex-col justify-between gap-2", {
            "px-4": !fullWidth,
          })}
        >
          <View
            className={cn("flex w-full flex-row items-center justify-between", {
              "px-4": fullWidth, // the fullWidth prop should have no effect on the back button
            })}
          >
            <View className={"flex flex-row items-center justify-start"}>
              <Button
                onPress={handleBack}
                variant={"ghost"}
                size={"md"}
                iconOnly
              >
                <Icon i={NavArrowLeft} />
              </Button>
              <Animated.Text
                style={[titleAnimatedStyle]}
                className={"title-t2-strong text-neutral-10-default"}
              >
                {title}
              </Animated.Text>
            </View>
            {rightTopComponent}
          </View>

          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};
