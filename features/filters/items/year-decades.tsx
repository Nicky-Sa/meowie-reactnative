import { BottomSheetWrapper } from "@/features/filters/elements/bottom-sheet-wrapper";
import { View } from "react-native";
import { Segment } from "@/features/filters/elements/segment";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const decades = [
  { id: "2020", name: "2020–Now" },
  { id: "2010", name: "2010–2019" },
  { id: "2000", name: "2000–2009" },
  { id: "1990", name: "1990–1999" },
  { id: "1980", name: "1980–1989" },
  { id: "1970", name: "1970–1979" },
  { id: "1960", name: "1960–1969" },
  { id: "1950", name: "1950–1959" },
  { id: "1940", name: "1940–1949" },
  { id: "1930", name: "1930–1939" },
  { id: "1920", name: "1920–1929" },
  { id: "1910", name: "1910–1919" },
  { id: "1900", name: "1900–1909" },
];
export const YearDecades = () => {
  const [filters] = useAtom(filtersAtom);

  return (
    <BottomSheetWrapper
      title={"Decade"}
      filterKey={"decade"}
      chipText={`${decades.find((dec) => dec.id === filters.decade[0])?.name}`}
    >
      {({ currentValues, setCurrentValues }) => (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className={"flex w-full flex-col gap-2"}>
            {decades.map((dec) => (
              <Segment
                key={dec.id}
                item={dec}
                setCurrentValues={setCurrentValues}
                isSelected={currentValues.includes(dec.id)}
              />
            ))}
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetWrapper>
  );
};
