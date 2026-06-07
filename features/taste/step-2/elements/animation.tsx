import { View } from "react-native";
import LottieView from "lottie-react-native";

type Props = { progress: number };

export const Animation = ({ progress }: Props) => {
  return (
    <View className="flex-1">
      <LottieView
        source={{
          uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/taste/taste-flexibility.json?v=1",
        }}
        resizeMode={"contain"}
        loop={false}
        autoPlay={false}
        progress={progress}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
};
