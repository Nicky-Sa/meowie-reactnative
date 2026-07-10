import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { tailwind } from "@/lib/tailwind";
import { Updater } from "use-immer";
import _ from "lodash";

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 8;
// The touchable column is wider than the visible circle so the value text fits
// and the touch target stays comfortable without reaching the screen edge,
// where iOS would claim the drag for the back-swipe gesture.
const THUMB_HIT_WIDTH = 40;
const THUMB_OVERHANG = (THUMB_HIT_WIDTH - THUMB_SIZE) / 2;
const THUMB_HIT_SLOP = { left: 4, right: 4, top: 12, bottom: 12 };

type Props = {
  currentValues: string[];
  setCurrentValues: Updater<string[]>;
  min: number;
  max: number;
  step?: number;
  labels?: string[];
  debounceDelay?: number;
};

export const Slider = ({
  currentValues,
  setCurrentValues,
  min,
  max,
  step = 1,
  labels,
  debounceDelay = 200,
}: Props) => {
  const hasLabels = labels !== undefined && labels.length > 0;
  const isRange = currentValues.length > 1;

  const [trackWidth, setTrackWidth] = useState(0);
  const travel = Math.max(trackWidth - THUMB_SIZE, 0);
  const stepCount = Math.max(Math.round((max - min) / step), 1);
  const stepLength = travel / stepCount;

  const lowPosition = useSharedValue(0);
  const highPosition = useSharedValue(0);
  const lowDragStart = useSharedValue(0);
  const highDragStart = useSharedValue(0);
  const activeDragCount = useSharedValue(0);

  // Thumb labels update live on every step while the parent update may be
  // debounced, so the displayed values are tracked separately.
  const [displayValues, setDisplayValues] = useState<number[]>(() =>
    currentValues.map(Number),
  );
  const committedValues = useRef<number[]>(currentValues.map(Number));

  // Create a debounced setter
  const debouncedSetCurrentValues = useMemo(
    () =>
      debounceDelay > 0
        ? _.debounce((values: string[]) => {
            setCurrentValues(values);
          }, debounceDelay)
        : (values: string[]) => setCurrentValues(values),
    [setCurrentValues, debounceDelay],
  );

  const reportThumbValue = useCallback(
    (thumbIndex: number, value: number) => {
      const nextValues = [...committedValues.current];
      nextValues[thumbIndex] = value;
      committedValues.current = nextValues;
      setDisplayValues(nextValues);
      debouncedSetCurrentValues(nextValues.map(String));
    },
    [debouncedSetCurrentValues],
  );

  // Keep thumbs in sync with the controlled value, except mid-drag — the
  // gesture is the source of truth then.
  useEffect(() => {
    if (activeDragCount.value > 0) return;
    const values = currentValues.map(Number);
    committedValues.current = values;
    setDisplayValues(values);
    const valueRange = max - min;
    const positionForValue = (value: number) =>
      valueRange > 0 ? ((value - min) / valueRange) * travel : 0;
    lowPosition.value = positionForValue(values[0]);
    if (values.length > 1) {
      highPosition.value = positionForValue(values[1]);
    }
  }, [
    currentValues,
    travel,
    min,
    max,
    activeDragCount,
    lowPosition,
    highPosition,
  ]);

  const makeThumbGesture = useCallback(
    (thumbIndex: 0 | 1) => {
      const position = thumbIndex === 0 ? lowPosition : highPosition;
      const dragStart = thumbIndex === 0 ? lowDragStart : highDragStart;
      return (
        Gesture.Pan()
          .maxPointers(1)
          .hitSlop(THUMB_HIT_SLOP)
          // Activate on the slightest horizontal pull, but hand vertical
          // movement over to the surrounding ScrollView.
          .activeOffsetX([-4, 4])
          .failOffsetY([-12, 12])
          .onBegin(() => {
            activeDragCount.value += 1;
            dragStart.value = position.value;
          })
          .onUpdate((event) => {
            if (stepLength === 0) return;
            let lowerBound = 0;
            let upperBound = travel;
            if (isRange) {
              // Range thumbs stop one step short of each other so they never
              // cross or stack on the same spot.
              if (thumbIndex === 0) {
                upperBound = highPosition.value - stepLength;
              } else {
                lowerBound = lowPosition.value + stepLength;
              }
            }
            const dragged = dragStart.value + event.translationX;
            const clamped = Math.min(Math.max(dragged, lowerBound), upperBound);
            const snapped = Math.round(clamped / stepLength) * stepLength;
            if (position.value === snapped) return;
            position.value = snapped;
            const value = min + Math.round(snapped / stepLength) * step;
            scheduleOnRN(reportThumbValue, thumbIndex, value);
          })
          .onFinalize(() => {
            activeDragCount.value -= 1;
          })
      );
    },
    [
      lowPosition,
      highPosition,
      lowDragStart,
      highDragStart,
      activeDragCount,
      stepLength,
      travel,
      isRange,
      min,
      step,
      reportThumbValue,
    ],
  );

  const [lowThumbGesture, highThumbGesture] = useMemo(
    // eslint-disable-next-line react-hooks/refs -- shared values are read in UI-thread worklets, not during render
    () => [makeThumbGesture(0), makeThumbGesture(1)],
    [makeThumbGesture],
  );

  const trackFillStyle = useAnimatedStyle(() => {
    const startEdge = isRange ? lowPosition.value + THUMB_SIZE / 2 : 0;
    const endEdge =
      (isRange ? highPosition.value : lowPosition.value) + THUMB_SIZE / 2;
    return { left: startEdge, width: endEdge - startEdge };
  });
  const lowThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lowPosition.value }],
  }));
  const highThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highPosition.value }],
  }));

  const trackTop = (THUMB_SIZE - TRACK_HEIGHT) / 2;
  const trackBorderRadius = Number(tailwind.theme.borderRadius.sm);

  const renderThumb = (
    gesture: ReturnType<typeof makeThumbGesture>,
    thumbStyle: typeof lowThumbStyle,
    displayValue: number,
  ) => (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={"absolute flex flex-col items-center gap-2"}
        style={[{ left: -THUMB_OVERHANG, width: THUMB_HIT_WIDTH }, thumbStyle]}
      >
        <View
          className={
            "h-6 w-6 rounded-full border-2 border-neutral-10-default bg-neutral-15-default"
          }
        />
        {!hasLabels && (
          <Text className={"body-b1 text-neutral-5-default"}>
            {displayValue}
          </Text>
        )}
      </Animated.View>
    </GestureDetector>
  );

  return (
    <View className={"flex w-full flex-col items-center"}>
      <View
        className={"w-full"}
        style={{ height: hasLabels ? THUMB_SIZE : 56 }}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        <View
          className={"absolute w-full"}
          style={{
            top: trackTop,
            height: TRACK_HEIGHT,
            borderRadius: trackBorderRadius,
            backgroundColor: tailwind.theme.backgroundColor.neutral[10].default,
          }}
        />
        <Animated.View
          className={"absolute"}
          style={[
            {
              top: trackTop,
              height: TRACK_HEIGHT,
              borderRadius: trackBorderRadius,
              backgroundColor: tailwind.theme.backgroundColor.brand[1].default,
            },
            trackFillStyle,
          ]}
        />
        {trackWidth > 0 && (
          <>
            {renderThumb(lowThumbGesture, lowThumbStyle, displayValues[0])}
            {isRange &&
              renderThumb(highThumbGesture, highThumbStyle, displayValues[1])}
          </>
        )}
      </View>
      {hasLabels && (
        <View className="mt-2 flex w-full flex-row justify-between">
          {labels.map((label, index) => {
            const valueForLabel =
              min + index * ((max - min) / (labels.length - 1));

            return (
              <Pressable
                key={label}
                onPress={() => setCurrentValues([String(valueForLabel)])}
                hitSlop={15}
              >
                <Text className={"body-b1 text-neutral-4-default"}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};
