import { Image } from "expo-image";
import { SkeletonItem } from "@/features/common/skeleton-item";
import { MoviePosterInfo } from "@/features/movies/movie-info/models/movie-info";

type Props = {
  data: MoviePosterInfo;
  isSkeletonData: boolean;
  width: number;
};

export const Poster = ({ data, isSkeletonData, width }: Props) => {
  return isSkeletonData ? (
    <PosterSkeleton width={width} />
  ) : (
    // if loading is true, it means this item is not even present (rendered) in the list, so no point in showing a skeleton
    <Image
      source={data.posterPath}
      style={{
        aspectRatio: 2 / 3,
        width,
      }}
      contentFit="cover"
      placeholder={{
        blurhash: "U6PZfSi_.AyE_3t7t7R**0o#DgR4_3R*D%xs",
        width: 100,
        height: 150,
      }}
      transition={500}
    />
  );
};

const PosterSkeleton = ({ width }: { width: number }) => {
  const height = width * (3 / 2);
  return (
    <SkeletonItem
      className={"rounded-none border border-neutral-4-default"}
      style={{ width, height }}
    />
  );
};
