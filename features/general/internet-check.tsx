import { Text, View } from "react-native";
import { Button } from "@/features/common/button";
import { PropsWithChildren } from "react";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import noInternetImg from "@/assets/images/no-internet.png";
import vpnWarningImg from "@/assets/images/vpn-warning.png";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { useCountryCheck } from "@/hooks/useCountryCheck";
import { Image } from "expo-image";
import { WarningModal } from "@/features/common/warning-modal";

export const InternetCheck = ({ children }: PropsWithChildren) => {
  const { height } = useScreenDimensions();
  const {
    netInfo: { isConnected, isInternetReachable },
    refresh,
  } = useNetInfoInstance();
  const noInternet = isConnected === false || isInternetReachable === false;

  const showVPNAlert = useCountryCheck();

  return (
    <>
      {noInternet ? (
        <View
          className={
            "flex-col items-center justify-center gap-10 bg-neutral-15-default"
          }
          style={{
            height,
          }}
        >
          <View className={"flex h-[25%] w-full flex-col items-center gap-6"}>
            <Image
              source={noInternetImg}
              style={{ width: 170, height: 170 }}
              contentFit="contain"
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
        <>
          {children}
          {showVPNAlert && (
            <WarningModal
              imageSrc={vpnWarningImg}
              warningText={
                "If you have trouble viewing the app content, please enable your VPN."
              }
              dismissText={"Ok"}
            />
          )}
        </>
      )}
    </>
  );
};
