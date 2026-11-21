import { forwardRef, memo } from "react";
import { View, Text, ViewInstance } from "react-native";
import { Image } from "expo-image";
import { tailwind } from "@/lib/tailwind";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";
import { WithTestID } from "@/features/common/test-id";

const SHADE_COLORS = ["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"];
const SHADE_POSITIONS = [0, 0.5, 1];

type Props = {
  posterUri: string;
  // Without a width, the poster fills its parent.
  width?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  aspectRatio?: number;
  transition?: number;
  blurhash?: string;
  recyclingKey?: string;
  title?: string;
  subtitle?: string | number;
  // Dims the card while a parent gesture is pressing it.
  pressed?: boolean;
  // Drawn on top of the card, so the poster doesn't shrink when it's selected.
  selected?: boolean;
};

const DEFAULT_RADIUS = Number(tailwind.theme.borderRadius.lg);

/**
 * Dumb, presentational poster tile
 * Forwards its ref, so a GestureDetector can wrap it directly.
 **/
export const PlainPoster = memo(
  forwardRef<ViewInstance, WithTestID<Props>>(
    (
      {
        posterUri,
        width,
        borderRadius = DEFAULT_RADIUS,
        borderColor,
        borderWidth = 0,
        aspectRatio = 2 / 3,
        transition = 300,
        blurhash,
        recyclingKey,
        title,
        subtitle,
        pressed = false,
        selected = false,
        testID,
      },
      ref,
    ) => {
      return (
        <View
          ref={ref}
          testID={testID}
          className={"relative overflow-hidden bg-neutral-11-default"}
          style={{ width, borderRadius, borderWidth, borderColor }}
        >
          <Image
            source={posterUri}
            style={{ aspectRatio, width: "100%" }}
            contentFit={"cover"}
            recyclingKey={recyclingKey}
            placeholder={
              blurhash ? { blurhash, width: 100, height: 150 } : undefined
            }
            transition={transition}
          />

          {title && (
            <>
              <GradientOverlay
                height={"50%"}
                colors={SHADE_COLORS}
                positions={SHADE_POSITIONS}
                className={"absolute bottom-0"}
              />
              <View className={"absolute bottom-2 left-2 right-2 items-start"}>
                <Text
                  className={"body-b2-strong text-neutral-10-default"}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text className={"body-b2 text-neutral-6-default"}>
                    {subtitle}
                  </Text>
                )}
              </View>
            </>
          )}

          {pressed && (
            <View className={"absolute inset-0 bg-neutral-15-default/30"} />
          )}

          {selected && (
            <View
              className={"absolute inset-0 border-4 border-brand-1-default"}
              // The layer sits inside the card's border, so its corners use the card's inner radius.
              style={{ borderRadius: borderRadius - borderWidth }}
            />
          )}
        </View>
      );
    },
  ),
);

PlainPoster.displayName = "PlainPoster";
