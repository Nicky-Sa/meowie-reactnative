import { PropsWithChildren } from "react";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";
import { View } from "react-native";
import { GradientCircle } from "@/features/movies/layout/gradient-circle";

export const MainBg = ({ children }: PropsWithChildren) => {
  const [color] = useAtom(colorAtom);

  return (
    <View className={"relative h-full w-full bg-neutral-15-default"}>
      <View className={"absolute -top-16 z-20"}>
        <GradientCircle color={color} />
      </View>
      {children}
    </View>
  );
};
