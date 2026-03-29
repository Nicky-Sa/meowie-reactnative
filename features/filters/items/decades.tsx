import { BottomSheetWrapper } from "@/features/filters/bottom-sheet-wrapper";
import { View } from "react-native";
import { Segment, SegmentItem } from "@/features/common/ui/segment";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const decades: SegmentItem[] = [
  { id: "any", label: "Any decade" },
  { id: "2020", label: "2020–Now" },
  { id: "2010", label: "2010–2019" },
  { id: "2000", label: "2000–2009" },
  { id: "1990", label: "1990–1999" },
  { id: "1980", label: "1980–1989" },
  { id: "1970", label: "1970–1979" },
  { id: "1960", label: "1960–1969" },
  { id: "1950", label: "1950–1959" },
  { id: "1940", label: "1940–1949" },
  { id: "1930", label: "1930–1939" },
  { id: "1920", label: "1920–1929" },
  { id: "1910", label: "1910–1919" },
  { id: "1900", label: "1900–1909" },
];

type Props = {
  value: string;
  isClearable: boolean;
  onApply: (newVal: string) => void;
  onClear: () => void;
};

export const Decades = ({ value, isClearable, onApply, onClear }: Props) => {
  return (
    <BottomSheetWrapper
      title={"Decade"}
      chipText={`${decades.find((dec) => dec.id === value)?.label}`}
      value={value}
      isClearable={isClearable}
      onApply={onApply}
      onClear={onClear}
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className={"flex w-full flex-col gap-2"}>
            {decades.map((dec) => (
              <Segment
                key={dec.id}
                item={dec}
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
