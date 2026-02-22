import { CastInfo } from "@/features/common/data/models/cast";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

export const Cast = ({ id, name, profilePath, character }: CastInfo) => {
  const router = useRouter();
  const { capture } = useCaptureEvent();

  const onCastPressed = useCallback(() => {
    capture("person_clicked", {
      person_id: id,
      person_name: name,
      role: character === "Director" ? "director" : "cast",
    });
  }, [capture, character, id, name]);

  const handlePress = () => {
    // id = -1 is a placeholder for unknown cast
    if (id > 0) {
      onCastPressed();
      router.push({ pathname: "/person", params: { personId: id } });
    }
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
