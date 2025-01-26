import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  color: string
};


export const GradientBg = ({ children, color }: PropsWithChildren<Props>) => {
  return (
    <LinearGradient
      colors={["transparent", "#000000"]}
      className={"h-full w-full flex-1 transition-all"}
      locations={[0.2, 1]}
      style={{
        backgroundColor: color,
      }}
    >
      {children}
    </LinearGradient>
  );
};
