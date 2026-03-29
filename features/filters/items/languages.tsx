import { BottomSheetWrapper } from "@/features/filters/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/ui/segment";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const languages: SegmentItem[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
  { id: "zh", label: "Mandarin" },
  { id: "hi", label: "Hindi" },
  { id: "ja", label: "Japanese" },
  { id: "ru", label: "Russian" },
  { id: "it", label: "Italian" },
  { id: "ko", label: "Korean" },
  { id: "pt", label: "Portuguese" },
  { id: "ar", label: "Arabic" },
  { id: "nl", label: "Dutch" },
  { id: "tr", label: "Turkish" },
  { id: "fa", label: "Persian" },
  { id: "pl", label: "Polish" },
  { id: "sv", label: "Swedish" },
  { id: "th", label: "Thai" },
  { id: "vi", label: "Vietnamese" },
  { id: "he", label: "Hebrew" },
];

type Props = {
  value: string[];
  isClearable: boolean;
  onApply: (newVal: string[]) => void;
  onClear: () => void;
};

export const Languages = ({ value, isClearable, onApply, onClear }: Props) => {
  return (
    <BottomSheetWrapper
      title={"Languages"}
      chipText={
        value.length === 1
          ? `${languages.find((lang) => lang.id === value[0])?.label}`
          : `${value.length}`
      }
      value={value}
      isClearable={isClearable}
      onApply={onApply}
      onClear={onClear}
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className={"flex w-full flex-col gap-2"}>
            {languages.map((lang) => (
              <Segment
                key={lang.id}
                item={lang}
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                multiple
              />
            ))}
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetWrapper>
  );
};
