import { View } from "react-native";
import { RadialGradient } from "react-native-gradients";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { useMemo } from "react";

type Props = {
  color: string;
};

export const GradientCircle = ({ color }: Props) => {
  const { width } = useScreenDimensions();

  const colorList = useMemo(
    () => [
      { color, offset: "0", opacity: "0.25" },
      {
        color: "transparent",
        offset: "1",
        opacity: "0",
      },
    ],
    [color],
  );
  return (
    <View className={"w-full items-center justify-center"}>
      <View className={"h-32"} style={{ width }}>
        <RadialGradient
          x="50%"
          y="50%"
          rx="60%"
          ry="50%"
          colorList={colorList}
        />
      </View>
    </View>
  );
};
