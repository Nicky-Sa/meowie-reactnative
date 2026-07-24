import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ShareIos } from "iconoir-react-native";
import { PersonalityCard } from "@/features/taste/steps/result/personality-card";
import { useCardImage } from "@/features/taste/steps/result/use-card-image";
import { Personality } from "@/features/taste/data/dto/taste.dto";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { tailwind } from "@/lib/tailwind";

type Props = {
  personality: Personality;
};

export const Revealed = ({ personality }: Props) => {
  const router = useRouter();
  const { share, isSharing } = useCardImage(personality);

  return (
    <View className={"mt-4 flex flex-1 flex-col gap-3"}>
      <Text className={"title-t2-strong text-center text-neutral-10-default"}>
        Meet your type
      </Text>
      <View className={"mx-8 flex-1 items-center justify-center"}>
        <PersonalityCard image={personality.image} />
      </View>
      <View className={"flex flex-col gap-3"}>
        <Button
          variant={"white"}
          size={"lg"}
          isLoading={isSharing}
          icon={
            <Icon
              i={ShareIos}
              color={tailwind.theme.textColor.neutral[1].default}
            />
          }
          onPress={share}
        >
          Share my type
        </Button>
        <Button
          variant={"black"}
          size={"lg"}
          onPress={() => router.replace("/home")}
        >
          Start exploring
        </Button>
      </View>
    </View>
  );
};
