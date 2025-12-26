import { useFetchPurifiedMoviesIds } from "@/features/movies/data/useFetchPurifiedMoviesIds";
import { MoviesList } from "@/features/common/movies-list/movies-list";
import { MainScreen } from "@/features/common/layout/main-screen";
import { SortHeaderButton } from "@/features/sort/header-button";
import { Header } from "@/features/general/layout/header";
import { useLocalSearchParams } from "expo-router";
import { Sort } from "@/features/common/data/query";

export const Screen = () => {
  const { sort } = useLocalSearchParams<{ sort: Sort }>();
  const {
    data,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useFetchPurifiedMoviesIds({ sort });

  return (
    <MainScreen>
      <Header headerButton={<SortHeaderButton />} />
      <MoviesList
        data={data}
        dataLength={dataLength}
        isLoading={isLoading}
        isValidating={isValidating}
        size={size}
        setSize={setSize}
        totalPages={totalPages}
        error={error}
        mutate={mutate}
      />
    </MainScreen>
  );
};
