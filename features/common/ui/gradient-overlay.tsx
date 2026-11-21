import { View, LayoutChangeEvent, DimensionValue } from "react-native";
import { Canvas, Fill, LinearGradient, vec } from "@shopify/react-native-skia";
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
    const [size, setSize] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
      const { width, height: layoutHeight } = event.nativeEvent.layout;
      setSize({ width, height: layoutHeight });
    };

    return (
      <View
        className={className}
        style={{ height, width: "100%" }}
        onLayout={onLayout}
        pointerEvents="none"
      >
        {/* Skia drops the part of a point from its drawing size, so the canvas is rounded up to cover the edge. */}
        <Canvas
          style={{
            width: Math.ceil(size.width),
            height: Math.ceil(size.height),
          }}
        >
          <Fill>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, size.height)}
              colors={colors}
              positions={positions}
            />
          </Fill>
        </Canvas>
      </View>
    );
  },
);

GradientOverlay.displayName = "GradientOverlay";
