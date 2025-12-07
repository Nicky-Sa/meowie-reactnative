import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { NavArrowLeft } from "iconoir-react-native";
import { PropsWithChildren, ReactNode, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

type Props = {
  title?: string;
  onBack?: () => void;
  rightTopComponent?: ReactNode;
};

export const InnerScreen = ({
  title,
  onBack,
  rightTopComponent,
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

  return (
    <View className={"flex-1 bg-neutral-15-default"}>
      <SafeAreaView>
        <View className={"flex h-full flex-col justify-between gap-2 p-4"}>
          <View className={"flex w-full flex-row items-center justify-between"}>
            <View className={"flex flex-row items-center justify-start"}>
              <Button
                onPress={handleBack}
                variant={"ghost"}
                size={"md"}
                iconOnly
              >
                <Icon i={NavArrowLeft} />
              </Button>
              <Text className={"title-t2-strong text-neutral-10-default"}>
                {title}
              </Text>
            </View>
            {rightTopComponent}
          </View>

          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};
