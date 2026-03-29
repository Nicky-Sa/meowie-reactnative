import { BottomSheetWrapper } from "@/features/filters/bottom-sheet-wrapper";
import { View } from "react-native";
import { Segment, SegmentItem } from "@/features/common/ui/segment";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const formats: SegmentItem[] = [
  { id: "any", label: "Any format" },
  { id: "miniseries", label: "Miniseries" },
  { id: "multiple-seasons", label: "Multiple Seasons" },
];

type Props = {
  value: string;
  isClearable: boolean;
  onApply: (newFormat: string) => void;
  onClear: () => void;
};

export const Formats = ({ value, isClearable, onApply, onClear }: Props) => {
  return (
    <BottomSheetWrapper
      title={"Format"}
      chipText={`${formats.find((fmt) => fmt.id === value)?.label}`}
      value={value}
      isClearable={isClearable}
      onApply={onApply}
      onClear={onClear}
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className={"flex w-full flex-col gap-2"}>
            {formats.map((formatOption) => (
              <Segment
                key={formatOption.id}
                item={formatOption}
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
              />
            ))}
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetWrapper>
  );
};
