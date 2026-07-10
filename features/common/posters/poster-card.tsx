import { forwardRef, memo } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { tailwind } from "@/lib/tailwind";
import { Badge } from "@/features/common/ui/badge";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";

type Props = {
  posterUri: string | null;
  width: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  aspectRatio?: number;
  transition?: number;
  blurhash?: string;
  recyclingKey?: string;
  // Bottom dark overlay with the title and a genre badge, layered over the image.
  showDetails?: boolean;
  title?: string;
  // Pre-composed badge text, e.g. "💔 Drama". Rendered when showDetails is set.
  genreBadge?: string;
  // Dims the card while a parent gesture is pressing it.
  pressed?: boolean;
};

const DEFAULT_RADIUS = Number(tailwind.theme.borderRadius.lg);

/**
 * Dumb, presentational poster tile: a rounded image with an optional bottom
 * dark overlay + title + genre badge, and a fallback for missing artwork. It owns no
 * interaction — the parent supplies tap/long-press (browse Poster) or a
 * selectable Pressable (taste picker). Forwards its ref so it can be the direct
 * child of a GestureDetector, which injects a ref.
 */
export const PosterCard = memo(
  forwardRef<View, Props>(function PosterCard(
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
      title,
      genreBadge,
      pressed = false,
    },
    ref,
  ) {
    return (
      <View
        ref={ref}
        className={"relative overflow-hidden"}
        style={{ width, borderRadius, borderWidth, borderColor }}
      >
        {posterUri ? (
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
        ) : (
          <View
            className={"items-center justify-center bg-neutral-12-default p-2"}
            style={{ aspectRatio }}
          >
            <Text
              className={"body-b2-strong text-center text-neutral-8-default"}
              numberOfLines={4}
            >
              {title}
            </Text>
          </View>
        )}

        {showDetails && posterUri && (
          <>
            <GradientOverlay
              height={"50%"}
              colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
              positions={[0, 0.5, 1]}
              className={"absolute -bottom-[1]"}
            />
            <View className={"absolute bottom-2 left-2 right-2 items-start"}>
              {title && (
                <Text
                  className={"body-b2-strong text-neutral-10-default"}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              )}
              {genreBadge && (
                <Badge text={genreBadge} variant={"ghost"} size={"unset"} />
              )}
            </View>
          </>
        )}

        {pressed && (
          <View className={"absolute inset-0 bg-neutral-15-default/30"} />
        )}
      </View>
    );
  }),
);

PosterCard.displayName = "PosterCard";
