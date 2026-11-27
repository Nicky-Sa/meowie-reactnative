import LottieView from "lottie-react-native";
import forceUpdateAnimation from "@/assets/lottie/force-update.json";

export const UpdateAnimation = () => {
  return (
    <LottieView
      source={forceUpdateAnimation}
      autoPlay
      loop
      style={{ width: 152, height: 142 }}
    />
  );
};
