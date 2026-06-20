import { View } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useSyncTaste } from "@/features/taste/data/use-sync-taste";

export const Animation = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const { syncTaste } = useSyncTaste();

  const onload = async () => {
    if (data?.user) {
      // User is logged in → sync taste (handles error internally)
      await syncTaste();
    }
  };

  const onFinish = async () => {
    if (data?.user) {
      // User is logged in → once animation is done, dismiss
      router.dismissTo("/settings");
    } else {
      // from onboarding screen -> redirect to auth
      // user's chosen taste stays in memory for this session
      router.replace("/auth?from=onboarding&returnTo=/home");
    }
  };

  return (
    <View className="flex-1">
      <LottieView
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/success.json?v=2",
        }}
        resizeMode={"contain"}
        loop={false}
        autoPlay={true}
        onAnimationLoaded={onload}
        onAnimationFinish={onFinish}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
};
