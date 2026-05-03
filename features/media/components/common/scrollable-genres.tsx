import { ScrollView } from "react-native";
import { Genres } from "@/features/media/components/info/elements/genres";
import { Genre } from "@/features/general/data/constants/useGenres";
import { MediaType } from "@/features/common/data/models/media-type";

type Props = {
  genres: Genre[];
  mediaType: MediaType;
  className: string;
};

export const ScrollableGenres = ({ genres, mediaType, className }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerClassName={"min-w-full h-6"} // fixed height in case the array is empty to prevent layout shift
    >
      <Genres genres={genres} mediaType={mediaType} />
    </ScrollView>
  );
};
