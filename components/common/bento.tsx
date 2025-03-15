import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { tailwind } from "@/lib/utils";
import { useTailwindBreakpoint } from "@/hooks/useTailwindBreakpoint";

type Props = {
  hasPadding?: boolean;
};

export const Bento = ({
  children,
  hasPadding = true,
}: PropsWithChildren<Props>) => {
  const size = useTailwindBreakpoint();

  return (
    <LinearGradient
      colors={[
        tailwind.theme.backgroundColor["neutral-11-default"],
        tailwind.theme.backgroundColor["neutral-12-default"],
      ]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor:
          tailwind.theme.borderColor["neutral-3-default"].concat("90"),
        width: "100%",
        padding: hasPadding ? (size === "xs" ? 8 : 12) : 0,
      }}
    >
      {children}
    </LinearGradient>
  );
};
