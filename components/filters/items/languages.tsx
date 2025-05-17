import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import {
  FilterItem,
  Selectable,
} from "@/components/filters/elements/selectable";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const languages: FilterItem[] = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "zh", name: "Mandarin" },
  { id: "hi", name: "Hindi" },
  { id: "ja", name: "Japanese" },
  { id: "ru", name: "Russian" },
  { id: "it", name: "Italian" },
  { id: "ko", name: "Korean" },
  { id: "pt", name: "Portuguese" },
  { id: "ar", name: "Arabic" },
  { id: "nl", name: "Dutch" },
  { id: "tr", name: "Turkish" },
  { id: "fa", name: "Persian" },
  { id: "pl", name: "Polish" },
  { id: "sv", name: "Swedish" },
  { id: "th", name: "Thai" },
  { id: "vi", name: "Vietnamese" },
  { id: "he", name: "Hebrew" },
];
export const Languages = () => {
  const [filters] = useAtom(filtersAtom);

  return (
    <BottomSheetWrapper
      title={"Languages"}
      filterKey={"languages"}
      chipText={
        filters.languages.length === 1
          ? `${languages.find((lang) => lang.id === filters.languages[0])?.name}`
          : `${filters.languages.length}`
      }
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className={"flex w-full flex-col gap-2"}>
            {languages.map((lang) => (
              <Selectable
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
