import { Text, View } from "react-native";

type Props = {
  genres: string[];
};

export const Genres = ({ genres }: Props) => {
  return (
    <View className={"flex flex-row gap-6 px-4"}>
      {genres.map((genre) => (
        <Text key={genre} className={"body-b2 text-neutral-5-default"}>
          {genre}
        </Text>
      ))}
    </View>
  );
};
