import { View, Text } from "react-native";
import { Image } from "expo-image";

type Props = {
  casts: { name: string; avatar: string }[];
};

export const Casts = ({ casts }: Props) => {
  return (
    <View className={"flex flex-row gap-3 px-4"}>
      {casts.map((cast) => (
        <Cast key={cast.name} {...cast} />
      ))}
    </View>
  );
};

const Cast = ({ name, avatar }: { name: string; avatar: string }) => {
  return (
    <View className={"flex flex-row items-center gap-2"}>
      <Image
        source={avatar}
        style={{
          width: 24,
          height: 24,
          borderRadius: 9999,
        }}
        contentFit="cover"
      />
      <Text className={"caption-c1-strong text-neutral-10-default"}>
        {name}
      </Text>
    </View>
  );
};
