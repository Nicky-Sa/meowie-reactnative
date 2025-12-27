import { BottomSheetWrapper } from "@/features/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { SegmentItem, Segment } from "@/features/common/ui/segment";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
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
export const Languages = () => {
  const [filters] = useAtom(filtersAtom);

  return (
    <BottomSheetWrapper
      title={"Languages"}
      filterKey={"languages"}
      chipText={
        filters.languages.length === 1
          ? `${languages.find((lang) => lang.id === filters.languages[0])?.label}`
          : `${filters.languages.length}`
      }
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
