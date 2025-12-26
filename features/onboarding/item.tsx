import { Text, View } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  lottiePath: string;
  title: string;
  body: string;
};

export const OnboardingItem = ({ lottiePath, title, body }: Props) => {
  return (
    <View className={"flex h-full w-full flex-col justify-between px-6"}>
      <LottieView
        source={{
          uri: lottiePath,
        }}
        autoPlay
        loop
        resizeMode={"cover"}
        style={{
          alignSelf: "center",
          width: "100%",
          height: "80%",
        }}
      />
      <View className={"flex flex-col gap-2"}>
        <Text className={"title-t1-strong text-neutral-10-default"}>
          {title}
        </Text>
        <Text className={"body-b2 text-neutral-10-default"}>{body}</Text>
      </View>
    </View>
  );
};
