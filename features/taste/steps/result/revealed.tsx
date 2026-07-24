import { View } from "react-native";
import { useRouter } from "expo-router";
import { MediaImage, ShareIos } from "iconoir-react-native";
import { PersonalityCard } from "@/features/taste/steps/result/personality-card";
import { useCardImage } from "@/features/taste/steps/result/use-card-image";
import { Personality } from "@/features/taste/data/dto/taste.dto";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { tailwind } from "@/lib/tailwind";

const ICON_SIZE = 20;

type Props = {
  personality: Personality;
};

export const Revealed = ({ personality }: Props) => {
  const router = useRouter();
  const { share, saveToPhotos, isSharing, isSaving } =
    useCardImage(personality);

  return (
    <>
      <View className={"w-full flex-1 items-center justify-center py-4"}>
        <PersonalityCard image={personality.image} />
      </View>
      <View className={"flex flex-col gap-2"}>
        <View className={"flex-row gap-2"}>
          <Button
            variant={"black"}
            size={"lg"}
            fill
            className={"flex-1"}
            isLoading={isSaving}
            icon={<Icon i={MediaImage} width={ICON_SIZE} height={ICON_SIZE} />}
            onPress={saveToPhotos}
          >
            Save image
          </Button>
          <Button
            variant={"white"}
            size={"lg"}
            fill
            className={"flex-1"}
            isLoading={isSharing}
            icon={
              <Icon
                i={ShareIos}
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={tailwind.theme.textColor.neutral[1].default}
              />
            }
            onPress={share}
          >
            Share
          </Button>
        </View>
        <Button
          variant={"black"}
          size={"lg"}
          onPress={() => router.replace("/home")}
        >
          Start exploring
        </Button>
      </View>
    </>
  );
};
