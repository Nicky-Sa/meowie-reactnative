import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { Selectable } from "@/components/filters/elements/selectable";
import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { useImmer } from "use-immer";

const languages = [
  "English",
  "French",
  "German",
  "Italian",
  "Spanish",
  "Japanese",
  "Chinese",
  "Korean",
  "Russian",
  "Arabic",
  "Hindi",
  "Portuguese",
  "Turkish",
  "Dutch",
  "Polish",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Greek",
  "Hungarian",
];

export const Languages = () => {
  const [filters] = useAtom(filtersAtom);
  const [currentValues, setCurrentValues] = useImmer(filters.languages);

  return (
    <BottomSheetWrapper
      title={"Languages"}
      filterKey={"languages"}
      currentValues={currentValues}
      setCurrentValues={setCurrentValues}
      chipText={filters.languages[0]}
    >
      <View className={"flex w-full flex-col gap-2"}>
        {languages.map((lang) => (
          <Selectable
            key={lang}
            item={lang}
            currentValues={currentValues}
            setCurrentValues={setCurrentValues}
          />
        ))}
      </View>
    </BottomSheetWrapper>
  );
};
