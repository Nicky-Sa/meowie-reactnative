import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PersonalityCard } from "@/features/taste/elements/personality-card";
import { ShareTypeButton } from "@/features/taste/elements/share-type-button";
import { Personality } from "@/features/taste/data/dto/taste.dto";
import { Button } from "@/features/common/ui/button";

type Props = {
  personality: Personality;
};

export const Revealed = ({ personality }: Props) => {
  const router = useRouter();

  return (
    <View className={"mt-4 flex flex-1 flex-col gap-3"}>
      <Text className={"title-t2-strong text-center text-neutral-10-default"}>
        Meet your type
      </Text>
      <View className={"mx-8 flex-1 items-center justify-center"}>
        <PersonalityCard image={personality.image} />
      </View>
      <View className={"flex flex-col gap-3"}>
        <ShareTypeButton personality={personality} />
        <Button
          variant={"black"}
          size={"lg"}
          onPress={() => router.replace("/home")}
        >
          Go home
        </Button>
      </View>
    </View>
  );
};
