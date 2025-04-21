import { Bento } from "@/components/common/bento";
import { Text } from "react-native";
import React from "react";
import { Slider } from "@/components/filters/elements/slider";

export const TMDBRating = () => {
  return (
    <Bento>
      <Text className={"body-b1-strong text-neutral-10-default"}>
        TMDB Rating
      </Text>
      <Slider />
    </Bento>
  );
};
