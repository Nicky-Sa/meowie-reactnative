import { Image } from "expo-image";
import { MoviePosterInfo } from "@/features/movies/models/movie-info";
import { Pressable } from "react-native";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useCallback } from "react";

type Props = {
  data: MoviePosterInfo;
  width: number;
  onPress: () => void;
};

export const Poster = ({ data, width, onPress }: Props) => {
  const { capture } = useCaptureEvent();
  const onPosterPressed = useCallback(() => {
    capture("poster_clicked", {
      movie_id: data.id,
    });
    onPress();
  }, [capture, data.id, onPress]);

  return (
    <Pressable onPress={onPosterPressed}>
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
