import { View, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { tailwind } from "@/lib/tailwind";
import { Updater } from "use-immer";
import { useMemo } from "react";
import _ from "lodash";
import { useScreenDimensions } from "@/hooks/use-screen-dimensions";

const CustomMarker = ({ currentValue }: { currentValue: number }) => (
  <View className={"flex flex-col items-center justify-center gap-2"}>
    <View
      className={
        "h-6 w-6 rounded-full border-2 border-neutral-10-default bg-neutral-15-default"
      }
    />
    <Text className={"body-b1 text-neutral-5-default"}>{currentValue}</Text>
  </View>
);

type Props = {
  currentValues: string[];
  setCurrentValues: Updater<string[]>;
  min: number;
  max: number;
  step?: number;
};

export const Slider = ({
  currentValues,
  setCurrentValues,
  min,
  max,
  step = 1,
}: Props) => {
  const { width } = useScreenDimensions();

  // Create a debounced setter
  const debouncedSetCurrentValues = useMemo(
    () =>
      _.debounce((values: string[]) => {
        setCurrentValues(values);
      }, 200),
    [setCurrentValues],
  );

  return (
    <View className={"flex w-full flex-col items-start px-4"}>
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
        }}
        unselectedStyle={{
          backgroundColor: tailwind.theme.backgroundColor.neutral[10].default,
          height: 8,
          borderRadius: Number(tailwind.theme.borderRadius.sm),
        }}
        markerOffsetY={18}
        sliderLength={width * 0.83}
        snapped
        customMarker={(e) => <CustomMarker currentValue={e.currentValue} />}
      />
    </View>
  );
};
