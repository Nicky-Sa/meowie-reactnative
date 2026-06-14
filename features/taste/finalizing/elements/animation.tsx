import { View } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import Toast from "react-native-toast-message";

export const Animation = () => {
  const router = useRouter();
  const { data } = useCurrentUser();

  const onFinish = () => {
    if (data?.user) {
      router.replace("/settings");
      Toast.show({
        type: "success",
        text1: "Your taste is updated. 🎉",
      });
    } else {
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
