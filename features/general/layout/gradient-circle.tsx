import { useLayoutEffect, useRef } from "react";
import { View } from "react-native";
import {
  Canvas,
  RadialGradient,
  Rect,
  vec,
  interpolateColors,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";

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

const useGradientAnimation = (color: string) => {
  // Animate color transitions smoothly — triggered during render, not in useEffect
  const progress = useSharedValue(1);
  const prevColor = useRef(color);

  // Pre-compute alpha-applied color stops (JS thread, where they're strings)
  const fromStops = useSharedValue([
    addAlpha(color, 0.4),
    addAlpha(color, 0.1),
    "transparent",
  ]);
  const toStops = useSharedValue([
    addAlpha(color, 0.4),
    addAlpha(color, 0.1),
    "transparent",
  ]);

  useLayoutEffect(() => {
    if (prevColor.current !== color) {
      fromStops.value = toStops.value;
      toStops.value = [
        addAlpha(color, 0.4),
        addAlpha(color, 0.1),
        "transparent",
      ];
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      prevColor.current = color;
    }
  }, [color, fromStops, toStops, progress]);

  // Interpolate each gradient color stop individually on the UI thread
  return useDerivedValue(() => {
    return [
      interpolateColors(
        progress.value,
        [0, 1],
        [fromStops.value[0], toStops.value[0]],
      ),
      interpolateColors(
        progress.value,
        [0, 1],
        [fromStops.value[1], toStops.value[1]],
      ),
      interpolateColors(
        progress.value,
        [0, 1],
        [fromStops.value[2], toStops.value[2]],
      ),
    ];
  });
};

export const GradientCircle = ({ color }: Props) => {
  const { width } = useScreenDimensions();
  // Large radius so the circle extends well beyond screen edges for a wide, soft glow
  const radius = width;
  // The view height matches the radius so the gradient fades fully — no hard cut
  const height = radius;

  const animatedColors = useGradientAnimation(color);

  return (
    <View style={{ width, height }}>
      <Canvas style={{ width, height }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width / 2, 0)}
            r={radius}
            colors={animatedColors}
            positions={[0, 0.5, 1]}
          />
        </Rect>
      </Canvas>
    </View>
  );
};
