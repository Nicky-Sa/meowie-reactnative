import { View } from "react-native";
import { Canvas, RadialGradient, Rect, vec } from "@shopify/react-native-skia";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";

type Props = {
  color: string;
};

// Simple helper to add alpha to hex colors
const addAlpha = (color: string, opacity: number) => {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    if (hex.length === 3) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${alpha}`;
    }
    return `#${hex}${alpha}`;
  }
  return color; // fallback for other formats
};

export const GradientCircle = ({ color }: Props) => {
  const { width } = useScreenDimensions();
  const height = 224; // h-56 in tailwind is 56 * 4 = 224

  return (
    <View className={"h-56 items-center justify-center"} style={{ width }}>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width / 2, height / 2)}
            r={height / 2}
            colors={[addAlpha(color, 0.25), "transparent"]}
            // Scale around the center to create an ellipse
            transform={[
              { translateX: width / 2 },
              { scaleX: 2.8 },
              { translateX: -width / 2 },
            ]}
          />
        </Rect>
      </Canvas>
    </View>
  );
};
