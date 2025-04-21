import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { Selectable } from "@/components/filters/elements/selectable";
import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { useImmer } from "use-immer";

const decades = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s"];

export const YearDecades = () => {
  const [filters] = useAtom(filtersAtom);
  const [currentValues, setCurrentValues] = useImmer(filters.decades);

  return (
    <BottomSheetWrapper
      title={"Decades"}
      filterKey={"decades"}
      currentValues={currentValues}
      setCurrentValues={setCurrentValues}
    >
      <View className={"flex w-full flex-col gap-2"}>
        {decades.map((dec) => (
          <Selectable
            key={dec}
            item={dec}
            currentValues={currentValues}
            setCurrentValues={setCurrentValues}
            multiple
          />
        ))}
      </View>
    </BottomSheetWrapper>
  );
};
