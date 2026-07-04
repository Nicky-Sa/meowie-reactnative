import {
  SearchResultMovieGenre,
  SearchResultSeriesGenre,
} from "@/features/search/data/models/search-result";
import { Brief } from "@/features/common/brief";
import { capitalize } from "@/lib/utils/strings";
import {
  MEDIA_TYPES_PLURALS,
  MediaType,
} from "@/features/common/data/models/media-type";
import { Link } from "@/features/common/ui/link";

type Props = {
  item: SearchResultMovieGenre | SearchResultSeriesGenre;
  onPress?: () => void;
};

const emojiToImage = (emoji: string) => {
  // Array.from handles surrogate pairs and multiple code points correctly
  const hex = Array.from(emoji)
    .map((char) => char.codePointAt(0)!.toString(16))
    .join("-");
  return `https://cdn.jsdelivr.net/gh/iamcal/emoji-data@v16.0.0/img-apple-160/${hex}.png`;
};

export const GenreCard = ({ item, onPress }: Props) => {
  const imageUrl = emojiToImage(item.emoji);
  const mediaType = item.mediaType.split("-")[0] as MediaType;

  return (
    <Link
      onPress={onPress}
      href={{
        pathname: "/discover/posters",
        params: {
          title: `${item.name} ${capitalize(MEDIA_TYPES_PLURALS[mediaType])}`,
          endpoint: `${mediaType}/posters`,
          genres: [item.id],
        },
      }}
    >
      <Brief
        imageUrl={imageUrl}
        firstLine={item.name}
        secondLine={`${capitalize(mediaType)} genre`}
        size="md"
        borderRadius={0}
      />
    </Link>
  );
};
