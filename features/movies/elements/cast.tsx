import { CastInfo } from "@/features/movies/movie-info/models/movie-info";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { filtersAtom } from "@/atoms";

export const Cast = ({ id, name, profilePath }: CastInfo) => {
  const router = useRouter();
  // const [, setFilters] = useAtom(filtersAtom);

  const handlePress = () => {
    if (id < 0) return;
    // setFilters((draft) => {
    //   draft["personId"] = id;
    // });
    router.push(`/movies/deep-dive?personId=${id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <View className={"flex flex-row items-center gap-1"}>
        <Image
          source={profilePath}
          style={{
            width: 24,
            height: 24,
            borderRadius: 9999,
          }}
          contentFit="cover"
          placeholder={{
            blurhash: "L5H2ECof00I04xayj[a{00aef6Rj",
            width: 100,
            height: 150,
          }}
        />
        <Text className={"caption-c1-strong text-neutral-10-default"}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
};
