import LottieView from "lottie-react-native";

export const Loading = () => {
  return (
    <LottieView
      source={{
        uri: "https://meowie-public.s3.eu-central-1.amazonaws.com/loading.json",
      }}
      autoPlay
      loop
      resizeMode={"contain"}
      style={{ alignSelf: "center", width: 48, height: 20 }}
    />
  );
};
