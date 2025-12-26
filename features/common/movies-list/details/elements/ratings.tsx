import { Text, View } from "react-native";
import type { AllRatings } from "@/features/movies/models/ratings";
import TMDBLogo from "@/assets/icons/ratings/tmdb.svg";
import IMDBLogo from "@/assets/icons/ratings/imdb.svg";
import RottenTomatoLogo from "@/assets/icons/ratings/rotten-tomato.svg";
import MetacriticLogo from "@/assets/icons/ratings/metacritic.svg";

type Props = AllRatings;

const ratingsItems = [
  {
    title: "The Movie Database",
    logo: <TMDBLogo />,
  },
  {
    title: "Internet Movie Database",
    logo: <IMDBLogo />,
  },
  {
    title: "Rotten Tomatoes",
    logo: <RottenTomatoLogo />,
  },
  {
    title: "Metacritic",
    logo: <MetacriticLogo />,
  },
];

export const Ratings = ({ ratings }: Props) => {
  return (
    <View className={"flex w-full flex-row items-center justify-start gap-6"}>
      {ratingsItems.map((item) => (
        <View className={"flex flex-row items-center gap-2"} key={item.title}>
          {item.logo}
          <Text className={"body-b1 text-neutral-5-default"}>
            {ratings.find((rating) => rating.source === item.title)?.value ??
              "N/A"}
          </Text>
        </View>
      ))}
    </View>
  );
};
