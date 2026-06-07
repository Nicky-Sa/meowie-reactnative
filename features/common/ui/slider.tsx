import { View, Text, Pressable } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { tailwind } from "@/lib/tailwind";
import { Updater } from "use-immer";
import _ from "lodash";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";
import { useMemo } from "react";

const CustomMarker = ({
  currentValue,
  hasLabels,
}: {
  currentValue: number;
  hasLabels: boolean;
}) => (
  <View className={"flex flex-col items-center justify-center gap-2"}>
    <View
      className={
        "h-6 w-6 rounded-full border-2 border-neutral-10-default bg-neutral-15-default"
      }
    />
    {!hasLabels && (
      <Text className={"body-b1 text-neutral-5-default"}>{currentValue}</Text>
    )}
  </View>
);

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
  const { width } = useScreenDimensions();

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

  return (
    <View className={"flex w-full flex-col items-center"}>
      <MultiSlider
        values={currentValues.map(Number)}
        min={min}
        max={max}
        step={step}
        onValuesChange={(values) => {
          debouncedSetCurrentValues(values.map(String));
        }}
        selectedStyle={{
          backgroundColor: tailwind.theme.backgroundColor.brand[1].default,
          height: 8,
          borderRadius: Number(tailwind.theme.borderRadius.sm),
        }}
        unselectedStyle={{
          backgroundColor: tailwind.theme.backgroundColor.neutral[10].default,
          height: 8,
          borderRadius: Number(tailwind.theme.borderRadius.sm),
        }}
        markerOffsetY={hasLabels ? 4 : 18}
        touchDimensions={{
          height: 100,
          width: 100,
          borderRadius: 20,
          slipDisplacement: 200,
        }}
        sliderLength={width * 0.9}
        snapped
        customMarker={(e) => (
          <CustomMarker currentValue={e.currentValue} hasLabels={hasLabels} />
        )}
      />
      {hasLabels && (
        <View className="flex w-full flex-row justify-between">
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
