import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { CollectionResDto } from "./collection.dto";
import { useRouter } from "expo-router";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

type Props = {
  collection: CollectionResDto;
};

export const CollectionCard = memo(({ collection }: Props) => {
  const router = useRouter();
  const { capture } = useCaptureEvent();

  const onPress = () => {
    capture("collection_clicked", {
      id: collection.id,
      title: collection.title,
      sourceType: collection.sourceType,
    });
    if (collection.sourceType === "group") {
      router.push({
        pathname: "/discover/sub-collections",
        params: { parentId: collection.id, title: collection.title },
      });
    } else {
      router.push({
        pathname: "/discover/posters",
        params: {
          title: collection.title,
          endpoint: `/collections/${collection.slug}/items`,
        },
      });
    }
  };

  const backdropSource = collection.backdropUrl;
  const logoSource = collection.logoUrl;

  return (
    <Pressable onPress={onPress} className={"h-24 overflow-hidden"}>
      {/* 1. Background Image (Anchored to the right) */}
      <View className="absolute inset-0">
        <Image
          source={{ uri: backdropSource }}
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
          contentFit="fill"
          transition={300}
        />
      </View>

      {/* 2. Foreground Content (Logo and Text) */}
      <View className="absolute inset-0 flex-row items-center gap-3 p-4">
        <Image
          source={{ uri: logoSource }}
          style={{ width: 40, height: 40 }} // Equivalent to w-16 h-8 📐
          contentFit="contain"
        />

        <Text
          className="body-b1-strong w-[60%] text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {collection.title}
        </Text>
      </View>
    </Pressable>
  );
});

CollectionCard.displayName = "CollectionCard";
