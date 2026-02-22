import { Text, View } from "react-native";
import {
  Rating_Source,
  RatingEntry,
} from "@/features/common/data/models/ratings";
import TMDBLogo from "@/assets/icons/ratings/tmdb.svg";
import IMDBLogo from "@/assets/icons/ratings/imdb.svg";
import RottenTomatoLogo from "@/assets/icons/ratings/rotten-tomato.svg";
import MetacriticLogo from "@/assets/icons/ratings/metacritic.svg";
import { Icon, SvgImage } from "@/features/common/ui/icon";

type Props = {
  ratings: RatingEntry[];
};

const ratingsItems: { title: Rating_Source; logo: SvgImage }[] = [
  {
    title: "TMDB",
    logo: TMDBLogo,
  },
  {
    title: "IMDb",
    logo: IMDBLogo,
  },
  {
    title: "Rotten Tomatoes",
    logo: RottenTomatoLogo,
  },
  {
    title: "Metacritic",
    logo: MetacriticLogo,
  },
];

export const Ratings = ({ ratings }: Props) => {
  return (
    <View className={"flex w-full flex-row items-center justify-start gap-6"}>
      {ratingsItems.map((item) => (
        <View className={"flex flex-row items-center gap-2"} key={item.title}>
          <Icon i={item.logo} />
          <Text className={"body-b1 text-neutral-5-default"}>
            {ratings.find((rating) => rating.source === item.title)?.value}
          </Text>
        </View>
      ))}
    </View>
  );
};
