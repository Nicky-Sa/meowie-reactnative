import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { PropsWithChildren, useEffect, useState } from "react";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import NoInternet from "@/assets/images/errors/no-internet.svg";
import VpnWarning from "@/assets/images/errors/vpn-warning.svg";
import { useCountryCheck } from "@/hooks/useCountryCheck";
import { InformationModal } from "@/features/common/information-modal";

export const InternetCheck = ({ children }: PropsWithChildren) => {
  const {
    netInfo: { isConnected, isInternetReachable },
    refresh,
  } = useNetInfoInstance();
  const noInternet = isConnected === false || isInternetReachable === false;
  const showVPNAlert = useCountryCheck();
  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    if (showVPNAlert) {
      setWarningVisible(true);
    }
  }, [showVPNAlert]);

  if (noInternet) {
    return (
      <View className={"flex-1 flex-col items-center justify-center gap-8"}>
        <NoInternet />

        <Text className={"body-b1 text-center text-neutral-5-default"}>
          There is no internet connection!
        </Text>
        <Button onPress={refresh} variant={"white"}>
          Try again
        </Button>
      </View>
    );
  }

  return (
    <>
      {children}
      <InformationModal
        img={VpnWarning}
        informationText={
          "اگه این متن رو میفهمی VPN رو روشن کن!" +
          "\n\n" +
          "If you have trouble viewing the app content, please enable your VPN."
        }
        modalVisible={warningVisible}
        setModalVisible={setWarningVisible}
      >
        <Button
          onPress={() => setWarningVisible(false)}
          variant={"white"}
          size={"md"}
          className={"w-full"}
        >
          OK
        </Button>
      </InformationModal>
    </>
  );
};
