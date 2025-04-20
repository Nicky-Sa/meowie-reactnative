import { FilterItemWrapper } from "@/components/filters/elements/wrapper";
import { View } from "react-native";
import { Selectable } from "@/components/filters/elements/selectable";
import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { useCallback } from "react";

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
  return (
    <FilterItemWrapper title={"Languages"}>
      <View className={"flex w-full flex-col gap-2"}>
        {languages.map((lang) => (
          <Selectable key={lang} item={lang} filterKey={"language"} />
        ))}
      </View>
    </FilterItemWrapper>
  );
};
