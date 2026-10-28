import { Pressable, View } from "react-native";
import { Chip } from "@/features/common/ui/chip";
import { useRouter } from "expo-router";
import { type Genre } from "@/features/general/data/constants/use-genres";
import { useCallback } from "react";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import {
  MEDIA_TYPES_PLURALS,
  MediaType,
} from "@/features/common/data/models/media-type";
import { capitalize } from "@/lib/utils/strings";

type Props = {
  genres: Genre[];
  mediaType: MediaType;
};

export const Genres = ({ genres, mediaType }: Props) => {
  return (
    <View className={"flex flex-row gap-3"}>
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
  const { media } = useAnalytics();

  const onGenrePressed = useCallback(() => {
    media.trackGenreClick({
      genreId: item.id,
      genreName: item.name,
      mediaType,
    });
  }, [media, item.id, item.name, mediaType]);

  const onPress = () => {
    onGenrePressed();
    router.push({
      pathname: "/discover/posters",
      params: {
        title: `${item.name} ${capitalize(MEDIA_TYPES_PLURALS[mediaType])}`,
        endpoint: `${mediaType}/posters`,
        genres: [item.id],
      },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <Chip text={item.name} />
    </Pressable>
  );
};
