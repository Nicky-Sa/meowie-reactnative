import { Image } from "expo-image";
import { PosterInfo } from "@/features/common/data/models/poster";
import { View } from "react-native";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { memo, useCallback, useState, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { Portal } from "@gorhom/portal";
import { PosterPreview } from "./poster-preview";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

type Props = {
  data: PosterInfo;
  width: number;
  onPress: () => void;
};

export const Poster = memo(({ data, width, onPress }: Props) => {
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
        .minDuration(250)
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

  return (
    <>
      <GestureDetector gesture={gesture}>
        <View style={{ width }}>
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
            transition={200}
          />
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
});

Poster.displayName = "Poster";
