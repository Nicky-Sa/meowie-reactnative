import { Pressable, View } from "react-native";
import { Chip } from "@/features/common/ui/chip";
import { useRouter } from "expo-router";
import { type Genre } from "@/features/general/data/constants/useGenres";
import { useCallback } from "react";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import { MediaType } from "@/features/common/data/models/media-type";

type Props = {
  genres: Genre[];
  mediaType: MediaType;
};

export const Genres = ({ genres, mediaType }: Props) => {
  return (
    <View className={"flex flex-row gap-3 px-4"}>
      {genres.map((item) => (
        <GenreItem key={item.id} item={item} mediaType={mediaType} />
      ))}
    </View>
  );
};

const GenreItem = ({
  item,
  mediaType,
}: {
  item: Genre;
  mediaType: MediaType;
}) => {
  const router = useRouter();
  const { capture } = useCaptureEvent();

  const onGenrePressed = useCallback(() => {
    capture("genre_clicked", {
      genre_id: item.id,
      genre_name: item.name,
      media_type: mediaType,
    });
  }, [capture, item.id, item.name, mediaType]);

  const onPress = () => {
    onGenrePressed();
    router.push({
      pathname: "/discover/posters",
      params: {
        title: `${item.name} ${mediaType === "movie" ? "Movies" : "TV Shows"}`,
        genres: [item.id],
        mediaType,
      },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <Chip text={item.name} bold />
    </Pressable>
  );
};
