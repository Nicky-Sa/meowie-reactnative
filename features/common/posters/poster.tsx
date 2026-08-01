import { PosterInfo } from "@/features/common/data/models/poster";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { memo, useCallback, useState, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { Portal } from "@gorhom/portal";
import { PosterPreview } from "./poster-preview";
import { PosterCard } from "./poster-card";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { tailwind } from "@/lib/tailwind";

type Props = {
  data: PosterInfo;
  width: number;
  isRounded?: boolean;
  showExtraDetails?: boolean;
  onPress: () => void;
};

export const Poster = memo(
  ({ data, width, isRounded, showExtraDetails, onPress }: Props) => {
    const { media } = useAnalytics();
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const onPosterPressed = useCallback(() => {
      media.trackClick({ mediaId: data.id, mediaType: data.mediaType });
      onPress();
    }, [media, data.id, data.mediaType, onPress]);

    const onLongPressTriggered = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsPreviewVisible(true);
      media.trackLongPress({ mediaId: data.id, mediaType: data.mediaType });
    }, [media, data.id, data.mediaType]);

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
          <PosterCard
            posterUri={data.posterPath}
            width={width}
            borderRadius={borderRadius}
            blurhash={data.blurhash}
            recyclingKey={data.posterPath}
            transition={400}
            showDetails={showExtraDetails}
            title={data.preview.title}
            badge={
              firstGenre ? `${firstGenre.emoji} ${firstGenre.name}` : undefined
            }
            pressed={isPressed}
          />
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
