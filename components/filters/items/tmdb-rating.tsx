import { useAtom } from "jotai/index";
import { filtersAtom } from "@/atoms";
import { BottomSheetWrapper } from "@/components/filters/elements/bottom-sheet-wrapper";
import { Slider } from "@/components/common/slider";

export const TMDBRating = () => {
  const [filters] = useAtom(filtersAtom);

  return (
    <BottomSheetWrapper
      title={"Ratings (TMDB)"}
      filterKey={"tmdbRatings"}
      chipText={`${filters.tmdbRatings[0]} - ${filters.tmdbRatings[1]}`}
      enableContentPanningGesture={false}
      index={0}
    >
      {({ currentValues, setCurrentValues }) => (
        <Slider
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          min={0}
          max={10}
        />
      )}
    </BottomSheetWrapper>
  );
};
