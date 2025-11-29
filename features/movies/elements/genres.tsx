import { View } from "react-native";
import { Chip } from "@/features/common/chip";

type Props = {
  genres: string[];
};

export const Genres = ({ genres }: Props) => {
  return (
    <View className={"flex flex-row gap-3 px-4"}>
      {genres.map((genre) => (
        <Chip key={genre} text={genre} bold />
      ))}
    </View>
  );
};
