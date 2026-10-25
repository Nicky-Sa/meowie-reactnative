import { PropsWithChildren } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/tailwind";

type Props = {
  className?: string;
};

export const HeaderContainer = ({
  children,
  className,
}: PropsWithChildren<Props>) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top + Platform.select({ android: 10, ios: 0, default: 0 });

  return (
    <View
      className={cn(
        "flex w-full flex-row items-center justify-between px-2",
        className,
      )}
      style={{ paddingTop }}
    >
      {children}
    </View>
  );
};
