import {
  SearchResultMovieGenre,
  SearchResultTvGenre,
} from "@/features/search/data/models/search-result";
import { Brief } from "@/features/common/brief";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  item: SearchResultMovieGenre | SearchResultTvGenre;
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
  const onPress = () => {
    router.push({
      pathname: "/discover/posters",
      params: {
        title: `${item.name} ${item.mediaType === "movie-genre" ? "Movies" : "TV Shows"}`,
        genres: [item.id],
        mediaType: item.mediaType === "movie-genre" ? "movie" : "tv",
      },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <Brief
        imageUrl={imageUrl}
        firstLine={item.name}
        secondLine={
          item.mediaType === "movie-genre" ? "Movie genre" : "TV genre"
        }
        size="md"
        borderRadius={0}
      />
    </Pressable>
  );
};
