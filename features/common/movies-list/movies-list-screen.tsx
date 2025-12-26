import { MoviesList } from "@/features/common/movies-list/movies-list";
import { useLocalSearchParams } from "expo-router";
import { useFetchMoviesPoster } from "@/features/browse/data/poster/useFetchMoviesPoster";
import { Header } from "@/features/common/movies-list/header";
import { MainScreen } from "@/features/common/layout/main-screen";
import { SearchParams } from "@/features/common/data/query";
import { ReactNode } from "react";

type Props = {
  rightTopComponent?: ReactNode;
};

export const MoviesListScreen = ({ rightTopComponent }: Props) => {
  const { title, initialIndex, ...searchParams } = useLocalSearchParams<
    {
      title: string;
      initialIndex: string;
    } & Partial<SearchParams>
  >();

  const {
    data: moviePosterData,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useFetchMoviesPoster(searchParams);
  const data = moviePosterData?.map((item) => item.id) || [];

  // Technically, this is an inner screen,
  // but since the MoviesList is a special component and doesn't tolerate external paddings or sibling components,
  // I have to use MainScreen + custom absolute header here.
  return (
    <MainScreen>
      <Header title={title} rightTopComponent={rightTopComponent} />
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
        initialScrollIndex={initialIndex ? Number(initialIndex) : undefined}
      />
    </MainScreen>
  );
};
