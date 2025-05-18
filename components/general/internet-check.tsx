import { Image, Text, View } from "react-native";
import { Button } from "@/components/common/button";
import { useContentScreenSize } from "@/components/movies/hooks";
import { PropsWithChildren } from "react";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import noInternetImg from "@/assets/images/no-internet.png";

export const InternetCheck = ({ children }: PropsWithChildren) => {
  const { height } = useContentScreenSize();
  const {
    netInfo: { isConnected, isInternetReachable },
    refresh,
  } = useNetInfoInstance();
  const noInternet = isConnected === false || isInternetReachable === false;

  return noInternet ? (
    <View
      className={"flex-col items-center justify-center gap-10"}
      style={{
        height,
      }}
    >
      <View className={"flex h-[25%] w-full flex-col items-center gap-4"}>
        <Image
          source={{
            uri: Image.resolveAssetSource(noInternetImg).uri,
          }}
          width={170}
          height={170}
          resizeMode={"contain"}
        />
        <Text className={"body-b1 text-center text-neutral-5-default"}>
          There is no internet connection!
        </Text>
      </View>
      <Button haptic onPress={refresh} variant={"primary"}>
        Try again
      </Button>
    </View>
  ) : (
    children
  );
};
