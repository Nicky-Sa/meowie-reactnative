import { MovieDetailsB } from "@/features/media/movie/movie-details-b";
import { MovieDetailsA } from "@/features/media/movie/movie-details-a";
import { useFeatureFlag } from "@/features/general/posthog/hook/use-feature-flag";
import { ID } from "@/features/common/data/media-query";

type Props = {
  movieId: ID;
  inScreen: boolean;
  tourEnabled?: boolean;
};

export const MovieDetails = ({ movieId, inScreen, tourEnabled }: Props) => {
  const layoutVariant = useFeatureFlag("details-layout");

  return layoutVariant === "test" ? (
    <MovieDetailsB
      movieId={movieId}
      inScreen={inScreen}
      tourEnabled={tourEnabled}
    />
  ) : (
    // "control" variant or flag not yet loaded — show default layout
    <MovieDetailsA
      movieId={movieId}
      inScreen={inScreen}
      tourEnabled={tourEnabled}
    />
  );
};
