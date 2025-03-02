import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { tailwind } from "@/lib/utils";
import { useTailwindBreakpoint } from "@/hooks/useTailwindBreakpoint";
import { useAtom } from "jotai";
import { colorAtom } from "@/atoms";

type Props = {
  hasPadding?: boolean;
};

const Bento = ({
  children,
  hasPadding = true,
}: PropsWithChildren<Props>) => {
  const size = useTailwindBreakpoint();
  const [color] = useAtom(colorAtom);

  return (
    <LinearGradient
      colors={[
        tailwind.theme.colors.primary[300],
        tailwind.theme.colors.primary[400],
      ]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: color ? `${color}20` : tailwind.theme.colors.primary[300],
        width: "100%",
        padding: hasPadding ? (size === "xs" ? 8 : 12) : 0,
      }}
    >
      {children}
    </LinearGradient>
  );
};
export default Bento;
