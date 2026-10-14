import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { UserLove, NavArrowDown } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import shareTastePicture from "@/assets/images/taste/vibe.png";
import { tailwind } from "@/lib/tailwind";

// The box needs a set size: both parents here size themselves to their
// children, so a percentage on the picture itself would come out as zero.
const ShareTasteImage = () => (
  <View className={"h-[200px] w-[310px]"}>
    <Image
      source={shareTastePicture}
      style={{ width: "100%", height: "100%" }}
      contentFit={"contain"}
    />
  </View>
);

/**
 * Inline feed card inviting users without a taste profile into the journey.
 * Rendered as a full page of the home feed (see use-share-taste-card for placement).
 */
export const ShareTasteCard = () => {
  const router = useRouter();

  const onShareTaste = () => {
    router.push("/taste");
  };

  return (
    <>
      <View className={"flex w-full flex-col items-center gap-8 px-6"}>
        <View className={"flex flex-col items-center gap-6"}>
          <ShareTasteImage />
          <View className={"flex flex-col items-center gap-2"}>
            <Text
              className={"title-t3-strong text-center text-neutral-10-default"}
            >
              Not finding your vibe?
            </Text>
            <Text className={"body-b1 text-center text-neutral-8-default"}>
              Tell us what you like and we’ll personalize your feed!
            </Text>
          </View>
          <Button
            variant={"primary"}
            size={"md"}
            icon={<Icon i={UserLove} />}
            iconPosition={"left"}
            onPress={onShareTaste}
          >
            Personalize my feed
          </Button>
        </View>
        <View className={"flex flex-col items-center gap-2"}>
          <Text className={"body-b2 text-center text-neutral-6-default"}>
            or continue swiping
          </Text>
          <Icon
            i={NavArrowDown}
            color={tailwind.theme.textColor.neutral[6].default}
          />
        </View>
      </View>
    </>
  );
};
