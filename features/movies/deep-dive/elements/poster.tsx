import { Image } from "expo-image";
import { SkeletonItem } from "@/features/common/skeleton-item";
import { MoviePosterInfo } from "@/features/movies/movies-info/models/movie-info";
import { Pressable } from "react-native";

type Props = {
  data: MoviePosterInfo;
  isSkeletonData: boolean;
  width: number;
  onPress: () => void;
};

export const Poster = ({ data, isSkeletonData, width, onPress }: Props) => {
  return isSkeletonData ? (
    <PosterSkeleton width={width} />
  ) : (
    // if loading is true, it means this item is not even present (rendered) in the list, so no point in showing a skeleton
    <Pressable onPress={onPress}>
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
    </Pressable>
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
