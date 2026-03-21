import { Image } from "expo-image";
import { PosterInfo } from "@/features/common/data/models/poster";
import { Pressable } from "react-native";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { useCallback } from "react";

type Props = {
  data: PosterInfo;
  width: number;
  onPress: () => void;
};

export const Poster = ({ data, width, onPress }: Props) => {
  const { capture } = useCaptureEvent();
  const onPosterPressed = useCallback(() => {
    capture("poster_clicked", {
      media_type: data.mediaType,
      media_id: data.id,
    });
    onPress();
  }, [capture, data.id, data.mediaType, onPress]);

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
