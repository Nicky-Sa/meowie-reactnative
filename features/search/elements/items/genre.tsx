import {
  SearchResultMovieGenre,
  SearchResultSeriesGenre,
} from "@/features/search/data/models/search-result";
import { Brief } from "@/features/common/brief";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { capitalize } from "@/lib/functions";
import {
  MEDIA_TYPES_PLURALS,
  MediaType,
} from "@/features/common/data/models/media-type";

type Props = {
  item: SearchResultMovieGenre | SearchResultSeriesGenre;
};

const emojiToImage = (emoji: string) => {
  // Array.from handles surrogate pairs and multiple code points correctly
  const hex = Array.from(emoji)
    .map((char) => char.codePointAt(0)!.toString(16))
    .join("-");
  return `https://cdn.jsdelivr.net/gh/iamcal/emoji-data@v16.0.0/img-apple-160/${hex}.png`;
};

export const GenreCard = ({ item }: Props) => {
  const imageUrl = emojiToImage(item.emoji);
  const router = useRouter();
  const mediaType = item.mediaType.split("-")[0] as MediaType;

  const onPress = () => {
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
      <Brief
        imageUrl={imageUrl}
        firstLine={item.name}
        secondLine={`${capitalize(mediaType)} genre`}
        size="md"
        borderRadius={0}
      />
    </Pressable>
  );
};
