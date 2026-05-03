import { View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { CreditInfo } from "@/features/common/data/models/credit";
import { useRouter } from "expo-router";

type Props = {
  cast: CreditInfo[];
  crew: CreditInfo[];
};

export const Credits = ({ cast, crew }: Props) => {
  return (
    <View className={"flex flex-col gap-8"}>
      <CreditSection title="Cast" items={cast} />
      <CreditSection title="Crew" items={crew} />
    </View>
  );
};

const CreditSection = ({
  title,
  items,
}: {
  title: string;
  items: CreditInfo[];
}) => {
  if (items.length === 0) return null;

  return (
    <View className={"flex flex-col gap-4"}>
      <Text className={"title-t2 px-4 text-neutral-10-default"}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={"px-4 gap-4"}
      >
        {items.map((item) => (
          <DetailedCreditItem key={item.id + item.role} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const DetailedCreditItem = ({ item }: { item: CreditInfo }) => {
  const router = useRouter();

  const handlePress = () => {
    if (item.id > 0) {
      router.push({ pathname: "/person", params: { personId: item.id } });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={"flex w-24 flex-col items-center gap-2"}
    >
      <View className={"h-16 w-16 overflow-hidden rounded-full"}>
        <Image
          source={item.profilePath}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <View className={"flex flex-col items-center"}>
        <Text
          numberOfLines={1}
          className={"body-b2 text-center text-neutral-10-default"}
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
          className={"caption-c1 text-center text-neutral-5-default"}
        >
          {item.role}
        </Text>
      </View>
    </Pressable>
  );
};
