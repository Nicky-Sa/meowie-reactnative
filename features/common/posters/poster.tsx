import { PosterInfo } from "@/features/common/data/models/poster";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { memo, useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import { Portal } from "@gorhom/portal";
import { PosterPreview } from "./poster-preview";
import { PosterCard } from "./poster-card";
import {
  GestureDetector,
  useExclusiveGestures,
  useLongPressGesture,
  useTapGesture,
} from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

type Props = {
  data: PosterInfo;
  width: number;
  showExtraDetails?: boolean;
  onPress: () => void;
};

export const Poster = memo(
  ({ data, width, showExtraDetails, onPress }: Props) => {
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

    const longPressGesture = useLongPressGesture({
      minDuration: 200,
      maxDistance: 1000, // Allow moving finger anywhere
      shouldCancelWhenOutside: false,
      onBegin: () => {
        scheduleOnRN(setIsPressed, true);
      },
      onActivate: () => {
        scheduleOnRN(onLongPressTriggered);
      },
      onFinalize: () => {
        scheduleOnRN(setIsPressed, false);
        scheduleOnRN(onLongPressEnded);
      },
    });

    const tapGesture = useTapGesture({
      onBegin: () => {
        scheduleOnRN(setIsPressed, true);
      },
      onDeactivate: () => {
        scheduleOnRN(onPosterPressed);
      },
      onFinalize: () => {
        scheduleOnRN(setIsPressed, false);
      },
    });

    const gesture = useExclusiveGestures(longPressGesture, tapGesture);

    const firstGenre = data.preview.genres[0];

    return (
      <>
        <GestureDetector gesture={gesture}>
          <PosterCard
            posterUri={data.posterPath}
            width={width}
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
