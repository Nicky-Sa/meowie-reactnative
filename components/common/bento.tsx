import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, View } from "react-native";
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
  const styles = {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    borderWidth: 1.5,
    borderColor: tailwind.theme.borderColor.neutral[3].default,
  };

  return (
    <View
      style={{
        ...(Platform.OS === "android" && styles),
        overflow: "hidden",
        width: "100%",
      }}
    >
      <LinearGradient
        colors={[
          tailwind.theme.backgroundColor.neutral[11].default,
          tailwind.theme.backgroundColor.neutral[12].default,
        ]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          ...(Platform.OS === "ios" && styles),
          padding: hasPadding
            ? size === "xs"
              ? Number(tailwind.theme.spacing["2"])
              : Number(tailwind.theme.spacing["3"])
            : 0,
        }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};
