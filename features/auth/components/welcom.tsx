import { Text, View } from "react-native";
import LottieView from "lottie-react-native";
import welcomeAnimation from "@/assets/lottie/welcome-login.json";

export const Welcome = () => {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-4">
      <View className="w-full items-center justify-center">
        <LottieView
          source={welcomeAnimation}
          autoPlay
          loop
          resizeMode={"contain"}
          style={{ width: "100%", height: 300 }}
        />
      </View>
      <View className={"flex w-2/3 flex-col items-center gap-2"}>
        <Text className={"title-t1-strong text-center text-neutral-10-default"}>
          Login to Meowie
        </Text>
        <Text className={"body-b2 text-center text-neutral-10-default"}>
          Unlock personalized movies and series tailored to your exact taste.
        </Text>
      </View>
    </View>
  );
};
