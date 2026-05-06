import { MovieInfoB } from "@/features/media/movie/info/movie-info-b";
import { MovieInfoA } from "@/features/media/movie/info/movie-info-a";
import { useFeatureFlag } from "@/features/general/posthog/hook/use-feature-flag";
import { ID } from "@/features/common/data/media-query";
import { useTrackTimeSpent } from "@/features/general/posthog/hook/use-track-time-spent";

type Props = {
  movieId: ID;
  inScreen: boolean;
  tourEnabled?: boolean;
};

export const MovieInfo = ({ movieId, inScreen, tourEnabled }: Props) => {
  const layoutVariant = useFeatureFlag("details-layout");

  // Track time spent on this screen
  useTrackTimeSpent(movieId, "movie");

  return layoutVariant === "test" ? (
    <MovieInfoB
      movieId={movieId}
      inScreen={inScreen}
      tourEnabled={tourEnabled}
    />
  ) : (
    // "control" variant or flag not yet loaded — show default layout
    <MovieInfoA
      movieId={movieId}
      inScreen={inScreen}
      tourEnabled={tourEnabled}
    />
  );
};
