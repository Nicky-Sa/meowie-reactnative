import { useFetchMoviesIds } from "@/features/movies/data/useFetchMoviesIds";
import { MoviesList } from "@/features/movies/elements/movies-list";
import { MainScreen } from "@/features/common/layout/main-screen";
import { SortHeaderButton } from "@/features/sort/header-button";
import { Header } from "@/features/general/layout/header";

export const Content = () => {
  const {
    data,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    error,
    mutate,
    queryKey,
  } = useFetchMoviesIds();

  return (
    <MainScreen>
      <Header headerButton={<SortHeaderButton />} />
      <MoviesList
        data={data}
        dataLength={dataLength}
        isLoading={isLoading}
        size={size}
        setSize={setSize}
        totalPages={totalPages}
        error={error}
        mutate={mutate}
        queryKey={queryKey} // to remount the list when filters or sort change
      />
    </MainScreen>
  );
};
