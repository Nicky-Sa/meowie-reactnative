import LottieView from "lottie-react-native";
import loadingAnimation from "@/assets/lottie/loading.json";

export const Loading = () => {
  return (
    <LottieView
      source={loadingAnimation}
      autoPlay
      loop
      resizeMode={"contain"}
      style={{ alignSelf: "center", width: 48, height: 24 }}
    />
  );
};
