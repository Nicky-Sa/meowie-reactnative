import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { UserLove, NavArrowDown } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { LoginWarningModal } from "@/features/auth/components/login-warning-modal";
import Vibe from "@/assets/images/taste/vibe.svg";
import { tailwind } from "@/lib/tailwind";

/**
 * Inline feed card inviting users without a taste profile into the journey.
 * Rendered as a full page of the home feed (see use-vibe-card for placement).
 */
export const VibeCard = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const onShareTaste = () => {
    if (!data?.user) {
      setShowLoginModal(true);
      return;
    }
    router.push("/taste");
  };

  return (
    <>
      <View className={"flex w-full flex-col items-center gap-8 px-6"}>
        <View className={"flex flex-col items-center gap-4"}>
          <Vibe />
          <View className={"flex flex-col items-center gap-2"}>
            <Text
              className={"title-t3-strong text-center text-neutral-10-default"}
            >
              Not finding your vibe?
            </Text>
            <Text className={"body-b1 text-center text-neutral-8-default"}>
              Tell us what you love, and we’ll personalize your feed with movies
              and shows you actually want to watch.
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

      <LoginWarningModal
        img={Vibe}
        text={
          "You'll need an account to share your taste and get personalized recommendations."
        }
        modalVisible={showLoginModal}
        setModalVisible={setShowLoginModal}
        returnTo={"/taste"}
      />
    </>
  );
};
