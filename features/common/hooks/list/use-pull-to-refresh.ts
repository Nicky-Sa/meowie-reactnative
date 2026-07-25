import { useState } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/** How far past the top a pull has to reach. The native control asks for roughly twice this. */
const PULL_TO_REFRESH = 50;

type Args = {
  scrollY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  onRefresh?: () => void;
  isRefreshing: boolean;
  isActive: boolean;
};

const startRefresh = (onRefresh: () => void) => {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  onRefresh();
};

/**
 * Pull-to-refresh on a shorter pull than the native control allows. The pull
 * shows the loading indicator as soon as it's far enough, and only runs the
 * refresh once the finger lifts. iOS only: Android stretches at the top rather
 * than reporting a negative offset, so it keeps the native control.
 *
 * The feed shares one `scrollY` across both tabs, so `isActive` decides which
 * list a pull belongs to — without it, pulling on one tab refreshes both.
 *
 * `isReadyToRefresh` says whether to show the indicator for the pull itself;
 * `isRefreshing` takes over once the request is running.
 */
export const usePullToRefresh = ({
  scrollY,
  isDragging,
  onRefresh,
  isRefreshing,
  isActive,
}: Args) => {
  const [isReadyToRefresh, setIsReadyToRefresh] = useState(false);
  const isPullFarEnough = useSharedValue(false);

  const isOn =
    Platform.OS === "ios" && isActive && !isRefreshing && !!onRefresh;

  useAnimatedReaction(
    () => ({ offset: scrollY.value, isHolding: isDragging.value }),
    ({ offset, isHolding }, previous) => {
      // Tracks the pull the whole way, so dragging back up before letting go
      // calls the refresh off.
      if (isHolding) {
        const isFarEnough = isOn && offset <= -PULL_TO_REFRESH;
        if (isFarEnough !== isPullFarEnough.value) {
          isPullFarEnough.value = isFarEnough;
          scheduleOnRN(setIsReadyToRefresh, isFarEnough);
        }
        return;
      }

      // The frame the finger lifts, and only that one.
      if (previous?.isHolding && isPullFarEnough.value && onRefresh) {
        scheduleOnRN(startRefresh, onRefresh);
      }

      // Drop the pull indicator only once the list has sprung back, so
      // `isRefreshing` picks it up without the indicator blinking in between.
      if (offset >= 0 && isPullFarEnough.value) {
        isPullFarEnough.value = false;
        scheduleOnRN(setIsReadyToRefresh, false);
      }
    },
    [isOn, onRefresh],
  );

  return { isReadyToRefresh };
};
