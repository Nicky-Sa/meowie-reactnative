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
        color,
        offset: "1",
        opacity: "0",
      },
    ],
    [color],
  );
  return (
    <View className={"h-56 items-center justify-center"} style={{ width }}>
      <RadialGradient x="50%" y="50%" rx="80%" ry="50%" colorList={colorList} />
    </View>
  );
};
