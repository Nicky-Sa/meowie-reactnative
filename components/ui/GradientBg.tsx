import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  colors: [string, string, ...string[]];
};

export const GradientBg = ({ children, colors }: PropsWithChildren<Props>) => {
  return (
    <LinearGradient
      colors={colors}
      className={"flex-1 h-full w-full bg-primary-100"}
      locations={[0.5, 1]}
    >
      {children}
    </LinearGradient>
  );
};
