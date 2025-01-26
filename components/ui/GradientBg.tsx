import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  colors: [string, string, ...string[]];
};


export const GradientBg = ({
  children,
  colors,
}: PropsWithChildren<Props>) => {

  return (
      <LinearGradient
        colors={colors}
        className={"h-full w-full flex-1 bg-primary-100"}
        locations={[0.5, 1]}
      >
        {children}
      </LinearGradient>
  );
};
