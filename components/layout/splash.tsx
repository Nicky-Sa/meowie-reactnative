// SplashScreen.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import Rive, { Alignment } from "rive-react-native";

export const SplashScreenComponent = () => {
  return (
    <View className={"w-full h-full bg-primary-200"}>
      <Rive
        url="https://meowie-public.s3.eu-central-1.amazonaws.com/Meowie-splash.riv"
        alignment={Alignment.Center}
      />
    </View>
  );
};
