import { View } from "react-native";
import { CastInfo } from "@/features/movies/models/movie-info";
import { Cast } from "@/features/movies/elements/cast";

type Props = {
  casts: CastInfo[];
};

export const Casts = ({ casts }: Props) => {
  return (
    <View className={"flex flex-row gap-5 px-4"}>
      {casts.map((cast) => (
        <Cast key={cast.name} {...cast} />
      ))}
    </View>
  );
};
