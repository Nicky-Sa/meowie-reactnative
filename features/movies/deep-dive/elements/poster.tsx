import { Image } from "expo-image";
import { useFetchMovieInfo } from "@/features/movies/movie-info/data/useFetchMovieInfo";
import { SkeletonItem } from "@/features/common/skeleton-item";

type Props = {
  movieId: number;
  width: number;
};

export const Poster = ({ movieId, width }: Props) => {
  const { data, isLoading } = useFetchMovieInfo(movieId);
  const isSkeletonData = movieId === -1;

  return isLoading || !data || isSkeletonData ? (
    <PosterSkeleton width={width} />
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

export const PosterSkeleton = ({ width }: { width: number }) => {
  const height = width * (3 / 2);
  return (
    <SkeletonItem
      className={"rounded-none border border-neutral-4-default"}
      style={{ width, height }}
    />
  );
};
