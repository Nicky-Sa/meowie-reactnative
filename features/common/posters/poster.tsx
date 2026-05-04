import { Image } from "expo-image";
import { PosterInfo } from "@/features/common/data/models/poster";
import { View, Text } from "react-native";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { memo, useCallback, useState, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { Portal } from "@gorhom/portal";
import { PosterPreview } from "./poster-preview";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { tailwind } from "@/lib/tailwind";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";
import { Badge } from "@/features/common/ui/badge";

type Props = {
  data: PosterInfo;
  width: number;
  isRounded?: boolean;
  showExtraDetails?: boolean;
  onPress: () => void;
};

export const Poster = memo(
  ({ data, width, isRounded, showExtraDetails, onPress }: Props) => {
    const { capture } = useCaptureEvent();
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const onPosterPressed = useCallback(() => {
      capture("poster_clicked", {
        media_type: data.mediaType,
        media_id: data.id,
      });
      onPress();
    }, [capture, data.id, data.mediaType, onPress]);

    const onLongPressTriggered = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsPreviewVisible(true);
      capture("poster_long_pressed", {
        media_type: data.mediaType,
        media_id: data.id,
      });
    }, [capture, data.id, data.mediaType]);

    const onLongPressEnded = useCallback(() => {
      setIsPreviewVisible(false);
    }, []);

    const longPressGesture = useMemo(
      () =>
        Gesture.LongPress()
          .minDuration(200)
          .maxDistance(1000) // Allow moving finger anywhere
          .shouldCancelWhenOutside(false)
          .onBegin(() => {
            scheduleOnRN(setIsPressed, true);
          })
          .onStart(() => {
            scheduleOnRN(onLongPressTriggered);
          })
          .onFinalize(() => {
            scheduleOnRN(setIsPressed, false);
            scheduleOnRN(onLongPressEnded);
          }),
      [onLongPressTriggered, onLongPressEnded],
    );

    const tapGesture = useMemo(
      () =>
        Gesture.Tap()
          .onBegin(() => {
            scheduleOnRN(setIsPressed, true);
          })
          .onEnd(() => {
            scheduleOnRN(onPosterPressed);
          })
          .onFinalize(() => {
            scheduleOnRN(setIsPressed, false);
          }),
      [onPosterPressed],
    );

    const gesture = useMemo(
      () => Gesture.Exclusive(longPressGesture, tapGesture),
      [longPressGesture, tapGesture],
    );

    const borderRadius = isRounded ? Number(tailwind.theme.borderRadius.lg) : 0;
    const firstGenre = data.preview.genres[0];

    return (
      <>
        <GestureDetector gesture={gesture}>
          <View
            style={{ width, borderRadius }}
            className="relative overflow-hidden"
          >
            <Image
              source={data.posterPath}
              style={{
                aspectRatio: 2 / 3,
                width,
              }}
              recyclingKey={data.posterPath}
              contentFit="cover"
              placeholder={{
                blurhash: data.blurhash,
                width: 100,
                height: 150,
              }}
              transition={400}
            />

            {showExtraDetails && (
              <>
                <GradientOverlay
                  height="50%"
                  colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
                  positions={[0, 0.5, 1]}
                  className={"absolute bottom-0"}
                />

                <View className="absolute bottom-2 left-2 right-2 items-start">
                  <Text
                    className="body-b2-strong text-neutral-10-default"
                    numberOfLines={1}
                  >
                    {data.preview.title}
                  </Text>
                  <Badge
                    text={`${firstGenre.emoji} ${firstGenre.name}`}
                    variant={"ghost"}
                    size={"unset"}
                  />
                </View>
              </>
            )}

            {isPressed && (
              <View className="absolute inset-0 bg-neutral-15-default/30" />
            )}
          </View>
        </GestureDetector>

        {isPreviewVisible && (
          <Portal hostName="global-overlay">
            <PosterPreview data={data} />
          </Portal>
        )}
      </>
    );
  },
);

Poster.displayName = "Poster";
