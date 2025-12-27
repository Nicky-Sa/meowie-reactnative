import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { PropsWithChildren } from "react";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import NoInternet from "@/assets/images/errors/no-internet.svg";
import VpnWarning from "@/assets/images/errors/vpn-warning.svg";
import { useCountryCheck } from "@/hooks/useCountryCheck";
import { WarningModal } from "@/features/common/warning-modal";

export const InternetCheck = ({ children }: PropsWithChildren) => {
  const {
    netInfo: { isConnected, isInternetReachable },
    refresh,
  } = useNetInfoInstance();
  const noInternet = isConnected === false || isInternetReachable === false;

  const showVPNAlert = useCountryCheck();

  return (
    <>
      {noInternet ? (
        <View className={"flex-1 flex-col items-center justify-center gap-8"}>
          <NoInternet />

          <Text className={"body-b1 text-center text-neutral-5-default"}>
            There is no internet connection!
          </Text>
          <Button onPress={refresh} variant={"white"}>
            Try again
          </Button>
        </View>
      ) : (
        <>
          {children}
          {showVPNAlert && (
            <WarningModal
              img={VpnWarning}
              warningText={
                "اگه این متن رو میفهمی VPN رو روشن کن!" +
                "\n\n" +
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
