import { Image } from "expo-image";
import { tailwind } from "@/lib/utils";
import { useFetchMovieInfo } from "@/features/movies/movie-info/data/useFetchMovieInfo";
import { SkeletonItem } from "@/features/common/skeleton-item";

type Props = {
  movieId: number;
  width: number;
};

export const Poster = ({ movieId, width }: Props) => {
  const { data, isLoading, error } = useFetchMovieInfo(movieId);

  return isLoading || !data ? (
    <PosterSkeleton />
  ) : (
    <Image
      source={data.posterPath}
      style={{
        aspectRatio: 2 / 3,
        width,
      }}
      contentFit="cover"
      placeholder={{
        blurhash: data.posterProps.blurhash,
        width: 100,
        height: 150,
      }}
      transition={500}
    />
  );
};

export const PosterSkeleton = () => {
  return <SkeletonItem className={"h-48 w-32 rounded-lg"} />;
};
