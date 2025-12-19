import { MoviesList } from "@/features/movies/elements/movies-list";
import { useLocalSearchParams } from "expo-router";
import { useFetchMoviesPoster } from "@/features/movies/deep-dive/data/poster/useFetchMoviesPoster";
import { Header } from "@/features/movies/deep-dive/movies-info/header";
import { MainScreen } from "@/features/common/layout/main-screen";

export const Content = () => {
  const { initialIndex, personId: personIdStr } = useLocalSearchParams<{
    initialIndex: string;
    personId: string;
  }>();
  const personId = Number(personIdStr);

  const {
    data: moviePosterData,
    dataLength,
    size,
    setSize,
    totalPages,
    isLoading,
    error,
    mutate,
  } = useFetchMoviesPoster({ personId });
  const data = moviePosterData?.map((item) => item.id) || [];

  // Technically, this is an inner screen,
  // but since the MoviesList is a special component and doesn't tolerate external paddings or sibling components,
  // I have to use MainScreen + custom absolute header here.
  return (
    <MainScreen>
      <Header personId={personId} />
      <MoviesList
        data={data}
        dataLength={dataLength}
        isLoading={isLoading}
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
