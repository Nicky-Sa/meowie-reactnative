import { Text, View } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  lottiePath: string;
  title: string;
  body: string;
};

export const OnboardingItem = ({ lottiePath, title, body }: Props) => {
  return (
    <View className="flex flex-1 flex-col justify-between px-6">
      <View className="w-full flex-1 items-center justify-center">
        <LottieView
          source={{ uri: lottiePath }}
          autoPlay
          loop
          resizeMode={"contain"}
          style={{ width: "100%", height: 400 }}
        />
      </View>
      <View className={"flex flex-col items-start justify-start gap-2"}>
        <Text className={"title-t1-strong text-neutral-10-default"}>
          {title}
        </Text>
        <Text className={"body-b2 text-neutral-10-default"}>{body}</Text>
      </View>
    </View>
  );
};
