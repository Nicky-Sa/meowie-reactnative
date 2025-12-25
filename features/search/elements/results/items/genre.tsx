import { SearchResultGenre } from "@/features/search/data/models/search-result";
import { Brief } from "@/features/common/brief";

type Props = {
  item: SearchResultGenre;
};

const emojiToImage = (emoji: string) => {
  const hex = emoji.codePointAt(0)?.toString(16);
  return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${hex}.png`;
};

export const GenreCard = ({ item }: Props) => {
  const imageUrl = emojiToImage(item.emoji);
  return (
    <Brief
      imageUrl={imageUrl}
      firstLine={item.name}
      secondLine={"Genre"}
      size="md"
    />
  );
};
