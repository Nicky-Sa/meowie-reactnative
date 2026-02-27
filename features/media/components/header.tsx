import { View, Text, Platform } from "react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { NavArrowLeft } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  rightTopComponent?: ReactNode;
};
export const Header = ({ title, subtitle, rightTopComponent }: Props) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const insets = useSafeAreaInsets();

  return (
    <View
      className={
        "absolute z-10 flex w-full flex-1 flex-row items-center justify-between px-2"
      }
      style={{
        paddingTop:
          insets.top + Platform.select({ android: 10, ios: 0, default: 0 }),
      }}
    >
      <View className={"flex flex-row items-center"}>
        <Button onPress={handleBack} variant={"ghost"} size={"md"} iconOnly>
          <Icon i={NavArrowLeft} />
        </Button>
        <View className={"mr-2 flex flex-1 flex-col gap-0.5"}>
          <Text
            numberOfLines={1}
            className={"title-t2-strong text-neutral-10-default"}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              className={"body-b1 h-6 text-neutral-5-default"}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightTopComponent}
    </View>
  );
};
