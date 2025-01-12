import React, { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  colors: [string, string, ...string[]];
};

export const GradientBg = ({ children, colors }: PropsWithChildren<Props>) => {
  return (
    <LinearGradient colors={colors} className={"flex-1 h-full w-full bg-black"}>
      {children}
    </LinearGradient>
  );
};
