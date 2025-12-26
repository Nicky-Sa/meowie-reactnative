import { MoviesListScreen } from "@/features/common/movies-list/movies-list-screen";
import { useLocalSearchParams } from "expo-router";
import { FilterIndicator } from "@/features/filters/elements/filter-indicator";

export const Screen = () => {
  const { modifiedFieldsNumber } = useLocalSearchParams<{
    modifiedFieldsNumber: string;
  }>();

  return (
    <MoviesListScreen
      rightTopComponent={
        <FilterIndicator modifiedFieldsNumber={Number(modifiedFieldsNumber)} />
      }
    />
  );
};
