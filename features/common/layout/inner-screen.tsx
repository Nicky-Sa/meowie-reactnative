import { View } from "react-native";
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

    const opacity = interpolate(scrollY.value, [20, 100], [0, 1], "clamp");

    return { opacity };
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
          <View className={"flex flex-row items-center justify-start"}>
            <Button
              onPress={handleBack}
              variant={"ghost"}
              size={"md"}
              iconPosition={"only"}
              icon={<Icon i={NavArrowLeft} />}
            />
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
  );
};
