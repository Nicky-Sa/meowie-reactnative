import { Text, View } from "react-native";
import { Image } from "expo-image";
import { cn } from "@/lib/tailwind";

const sizes = {
  lg: {
    imageWidth: 80,
    firstLineClassName: "title-t2-strong",
  },
  md: {
    imageWidth: 56,
    firstLineClassName: "body-b1",
  },
};

type Props = {
  imageUrl: string;
  firstLine: string;
  secondLine: string;
  size: "lg" | "md";
};

export const Brief = ({ imageUrl, firstLine, secondLine, size }: Props) => {
  return (
    <View className={"flex flex-row items-center gap-3"}>
      <Image
        source={imageUrl}
        style={{
          width: sizes[size].imageWidth,
          aspectRatio: 1,
          borderRadius: 9999,
        }}
        contentFit="cover"
        placeholder={{
          blurhash: "L5H2ECof00I04xayj[a{00aef6Rj",
          width: 100,
          height: 150,
        }}
      />
      <View className={"flex flex-col gap-1"}>
        <Text
          className={cn(
            sizes[size].firstLineClassName,
            "text-neutral-10-default",
          )}
        >
          {firstLine}
        </Text>
        <Text className={"body-b2 text-neutral-6-default"}>{secondLine}</Text>
      </View>
    </View>
  );
};
