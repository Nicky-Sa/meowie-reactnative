import { Icon } from "@/features/common/ui/icon";
import { NavArrowRight } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Action } from "@/features/common/ui/action";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { LoginWarningModal } from "@/features/auth/components/login-warning-modal";
import CoolMeowie from "@/assets/images/meowie/cool-meowie.svg";

export const Taste = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const hasFilledInTaste = Boolean(data?.user?.hasFilledInTaste);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlePress = () => {
    if (!data?.user) {
      setShowLoginModal(true);
      return;
    }
    router.push(hasFilledInTaste ? "/settings/taste" : "/taste");
  };

  return (
    <>
      <Action
        variant={hasFilledInTaste ? "black" : "promoted"}
        onPress={handlePress}
        icon={<Icon i={NavArrowRight} />}
      >
        {hasFilledInTaste ? "My taste" : "Share your taste"}
      </Action>

      <LoginWarningModal
        img={CoolMeowie}
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
