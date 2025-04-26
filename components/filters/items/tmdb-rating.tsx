import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { useImmer } from "use-immer";
import { Slider } from "@/components/common/slider";
import { View } from "react-native";

export const TMDBRating = () => {
  const [filters] = useAtom(filtersAtom);
  const [currentValues, setCurrentValues] = useImmer(filters.tmdbRatings);

  return (
    <BottomSheetWrapper
      title={"Ratings (TMDB)"}
      filterKey={"tmdbRatings"}
      currentValues={currentValues}
      setCurrentValues={setCurrentValues}
      chipText={`${filters.tmdbRatings[0]} - ${filters.tmdbRatings[1]}`}
      enableContentPanningGesture={false}
      index={0}
    >
      <View>
        <Slider
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          min={0}
          max={10}
        />
      </View>
    </BottomSheetWrapper>
  );
};
