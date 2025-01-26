import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

type Props = {
  colors: [string, string, ...string[]];
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const GradientBg = ({ children, colors }: PropsWithChildren<Props>) => {
  return (
    <LinearGradient
      colors={colors}
      className={"h-full w-full flex-1 bg-primary-100"}
      locations={[0.5, 1]}
      style={{
        height: SCREEN_HEIGHT,
      }}
    >
      {children}
    </LinearGradient>
  );
};
