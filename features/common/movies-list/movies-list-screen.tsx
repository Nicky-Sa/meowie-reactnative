import { MoviesList } from "@/features/common/movies-list/movies-list";
import { Header } from "@/features/common/movies-list/header";
import { MainScreen } from "@/features/common/layout/main-screen";
import { ReactNode } from "react";
import { PosterHookResult } from "@/features/common/posters/types";
import { useScrollHandler } from "@/features/common/hooks/list/useScrollHandler";

type Props = {
  title: string;
  initialIndex?: number;
  subtitle?: string;
  subtitleIsLoading?: boolean;
  posterData: PosterHookResult;
  rightTopComponent?: ReactNode;
};

export const MoviesListScreen = ({
  title,
  initialIndex,
  subtitle,
  subtitleIsLoading,
  posterData,
  rightTopComponent,
}: Props) => {
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
  } = posterData;

  const data = moviePosterData?.map((item) => item.id) || [];
  const { scrollHandler, scrollY, currentIndex, onLoad } = useScrollHandler();

  // Technically, this is an inner screen,
  // but since the MoviesList is a special component and doesn't tolerate external paddings or sibling components,
  // I have to use MainScreen + custom absolute header here.
  return (
    <MainScreen>
      <Header
        title={title}
        subtitle={subtitle}
        subtitleIsLoading={subtitleIsLoading}
        rightTopComponent={rightTopComponent}
      />
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
        initialScrollIndex={initialIndex}
        scrollHandler={scrollHandler}
        scrollY={scrollY}
        currentIndex={currentIndex}
        onLoad={onLoad}
      />
    </MainScreen>
  );
};
