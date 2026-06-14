import { View } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

export const Animation = () => {
  const router = useRouter();
  return (
    <View className="flex-1">
      <LottieView
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/success.json?v=1",
        }}
        resizeMode={"contain"}
        loop={false}
        autoPlay={true}
        onAnimationFinish={() => router.replace("/(tabs)/home")}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
};
