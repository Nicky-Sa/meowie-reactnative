import { Image } from "expo-image";
import { MoviePosterInfo } from "@/features/movies/models/movie-info";
import { Pressable } from "react-native";

type Props = {
  data: MoviePosterInfo;
  width: number;
  onPress: () => void;
};

export const Poster = ({ data, width, onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <Image
        source={data.posterPath}
        style={{
          aspectRatio: 2 / 3,
          width,
        }}
        contentFit="cover"
        placeholder={{
          blurhash: data.blurhash,
          width: 100,
          height: 150,
        }}
        transition={200}
      />
    </Pressable>
  );
};
