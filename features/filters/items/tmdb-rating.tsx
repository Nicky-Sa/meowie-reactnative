import { BottomSheetWrapper } from "@/features/filters/bottom-sheet-wrapper";
import { Slider } from "@/features/common/ui/slider";

type Props = {
  value: string[];
  isClearable: boolean;
  onApply: (newVal: string[]) => void;
  onClear: () => void;
};

export const TMDBRating = ({ value, isClearable, onApply, onClear }: Props) => {
  return (
    <BottomSheetWrapper
      title={"Ratings (TMDB)"}
      chipText={`${value[0]} - ${value[1]}`}
      enableContentPanningGesture={false}
      index={0}
      value={value}
      isClearable={isClearable}
      onApply={onApply}
      onClear={onClear}
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
