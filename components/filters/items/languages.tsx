import { FilterItemWrapper } from "@/components/filters/elements/wrapper";
import { View } from "react-native";
import { Selectable } from "@/components/filters/elements/selectable";
import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { useCallback } from "react";
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
  const [currentValues, setCurrentValues] = useImmer(filters.language);

  return (
    <FilterItemWrapper
      title={"Languages"}
      filterKey={"language"}
      currentValues={currentValues}
      setCurrentValues={setCurrentValues}
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
    </FilterItemWrapper>
  );
};
