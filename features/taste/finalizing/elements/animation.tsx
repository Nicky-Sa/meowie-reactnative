import { View } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { useSyncTaste } from "@/features/taste/data/use-sync-taste";

export const Animation = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const { syncTaste } = useSyncTaste();

  const onFinish = async () => {
    if (data?.user) {
      // User is logged in → sync taste now, then dismiss (handles error internally)
      await syncTaste();
      router.dismissTo("/settings");
    } else {
      // Guest → redirect to auth. Taste atoms survive in memory.
      // Will sync after login via auth success hooks.
      router.replace("/auth?returnTo=/(tabs)/home");
    }
  };

  return (
    <View className="flex-1">
      <LottieView
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/success.json?v=1",
        }}
        resizeMode={"contain"}
        loop={false}
        autoPlay={true}
        onAnimationFinish={onFinish}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
};
