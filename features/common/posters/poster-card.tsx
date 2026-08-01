import { forwardRef, memo } from "react";
import { View, Text, DimensionValue } from "react-native";
import { Image } from "expo-image";
import { cn, tailwind } from "@/lib/tailwind";
import { Badge } from "@/features/common/ui/badge";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";

// Only the bottom overlay changes — the image is sized by the parent.
type DetailsSize = "small" | "large";

type DetailsStyle = {
  gradientHeight: DimensionValue;
  gradientColors: string[];
  gradientPositions: number[];
  box: string;
  titleText: string;
  titleLines: number;
};

const detailsSizes: Record<DetailsSize, DetailsStyle> = {
  small: {
    gradientHeight: "50%",
    gradientColors: ["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"],
    gradientPositions: [0, 0.5, 1],
    box: "bottom-2 left-2 right-2",
    titleText: "body-b2-strong",
    titleLines: 1,
  },
  large: {
    gradientHeight: "40%",
    gradientColors: ["transparent", "rgba(0,0,0,0.75)", "rgba(0,0,0,0.9)"],
    gradientPositions: [0, 0.6, 1],
    box: "bottom-4 left-4 right-4",
    titleText: "title-t1-strong",
    titleLines: 2,
  },
};

type Props = {
  posterUri: string;
  width: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  aspectRatio?: number;
  transition?: number;
  blurhash?: string;
  recyclingKey?: string;
  showDetails?: boolean;
  detailsSize?: DetailsSize;
  title?: string;
  subtitle?: string | number;
  badge?: string;
  // Dims the card while a parent gesture is pressing it.
  pressed?: boolean;
};

const DEFAULT_RADIUS = Number(tailwind.theme.borderRadius.lg);

/**
 * Dumb, presentational poster tile: a rounded image with an optional bottom
 * dark overlay carrying the title, a second line and a genre badge. It owns no
 * interaction — the parent supplies tap/long-press (browse Poster) or a
 * selectable Pressable (taste picker). Forwards its ref so it can be the direct
 * child of a GestureDetector, which injects a ref.
 */
export const PosterCard = memo(
  forwardRef<View, Props>(
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
        showDetails = false,
        detailsSize = "small",
        title,
        subtitle,
        badge,
        pressed = false,
      },
      ref,
    ) => {
      const details = detailsSizes[detailsSize];

      return (
        <View
          ref={ref}
          className={"relative overflow-hidden"}
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

          {showDetails && (
            <>
              <GradientOverlay
                height={details.gradientHeight}
                colors={details.gradientColors}
                positions={details.gradientPositions}
                className={"absolute -bottom-[1]"}
              />
              <View className={cn("absolute items-start", details.box)}>
                {title && (
                  <Text
                    className={cn(details.titleText, "text-neutral-10-default")}
                    numberOfLines={details.titleLines}
                  >
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text className={"body-b2 text-neutral-5-default"}>
                    {subtitle}
                  </Text>
                )}
                {badge && (
                  <Badge text={badge} variant={"ghost"} size={"unset"} />
                )}
              </View>
            </>
          )}

          {pressed && (
            <View className={"absolute inset-0 bg-neutral-15-default/30"} />
          )}
        </View>
      );
    },
  ),
);

PosterCard.displayName = "PosterCard";
