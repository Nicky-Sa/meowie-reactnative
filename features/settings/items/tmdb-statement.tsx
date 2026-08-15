import { View, Text } from "react-native";
import TMDBGrayLogo from "@/assets/icons/tmdb-gray.svg";

export const TMDBStatement = () => {
  return (
    <View
      className={
        "mx-auto flex w-[70%] flex-row items-center justify-center gap-3"
      }
    >
      <TMDBGrayLogo />
      <Text className={"caption-c1 shrink text-neutral-4-default"}>
        This product uses TMDB and the TMDB APIs but is not endorsed, certified,
        or otherwise approved by TMDB.
      </Text>
    </View>
  );
};
