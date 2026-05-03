import { View, LayoutChangeEvent, DimensionValue } from "react-native";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useState, memo } from "react";

type Props = {
  height: DimensionValue;
  colors?: string[];
  positions?: number[];
  className?: string;
};

/**
 * A reusable Skia-based linear gradient overlay.
 * Goes from top (transparent) to bottom (solid).
 */
export const GradientOverlay = memo(
  ({
    height,
    colors = ["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"],
    positions = [0, 0.5, 1],
    className,
  }: Props) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
      const { width, height: h } = event.nativeEvent.layout;
      setDimensions({ width, height: h });
    };

    return (
      <View
        className={className}
        style={{ height, width: "100%" }}
        onLayout={onLayout}
        pointerEvents="none"
      >
        <Canvas style={{ width: "100%", height: "100%" }}>
          <Rect x={0} y={0} width={dimensions.width} height={dimensions.height}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, dimensions.height)}
              colors={colors}
              positions={positions}
            />
          </Rect>
        </Canvas>
      </View>
    );
  },
);

GradientOverlay.displayName = "GradientOverlay";
