import { Pressable, View } from "react-native";
import { Chip } from "@/features/common/chip";
import { useRouter } from "expo-router";
import { type Genre } from "@/features/general/data/constants/useGenres";

type Props = {
  genres: Genre[];
};

export const Genres = ({ genres }: Props) => {
  return (
    <View className={"flex flex-row gap-3 px-4"}>
      {genres.map((item) => (
        <GenreItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const GenreItem = ({ item }: { item: Genre }) => {
  const router = useRouter();
  const onPress = () => {
    router.push({
      pathname: "/browse",
      params: { title: item.name, genres: [item.id] },
    });
  };
  return (
    <Pressable onPress={onPress}>
      <Chip text={item.name} bold />
    </Pressable>
  );
};
