import { PersonalityCard } from "@/features/taste/steps/result/personality-card";
import { useShareCard } from "@/features/taste/steps/result/use-share-card";
import { useRouter } from "expo-router";
import { ResolvedPersonality } from "@/features/taste/data/dto/taste.dto";
import { View } from "react-native";
import { Button } from "@/features/common/ui/button";

type Props = {
  personality: ResolvedPersonality;
};

export const Revealed = ({ personality }: Props) => {
  const router = useRouter();
  const { cardRef, share } = useShareCard(personality);

  return (
    <>
      <View className={"flex flex-1 items-center justify-center"}>
        <PersonalityCard ref={cardRef} personality={personality} />
      </View>
      <View className={"flex flex-col gap-2"}>
        <Button variant={"white"} size={"lg"} onPress={share}>
          Share my type
        </Button>
        <Button
          variant={"black"}
          size={"lg"}
          onPress={() => router.replace("/home")}
        >
          Start watching
        </Button>
      </View>
    </>
  );
};
