import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { PropsWithChildren, useEffect, useState } from "react";
import NoInternet from "@/assets/images/errors/no-internet.svg";
import VpnWarning from "@/assets/images/errors/vpn-warning.svg";
import { InformationModal } from "@/features/common/information-modal";
import { useConnectionCheck } from "@/hooks/useConnectionCheck";

export const InternetCheck = ({ children }: PropsWithChildren) => {
  const { isOffline, isRestricted, refresh } = useConnectionCheck();

  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    if (isRestricted) setWarningVisible(true);
  }, [isRestricted]);

  // Strictly "No Radio" state
  if (isOffline) {
    return (
      <View className="flex-1 flex-col items-center justify-center gap-8 px-6">
        <NoInternet />
        <Text className="body-b1 text-center text-neutral-5-default">
          Please check your internet settings.
        </Text>
        <Button onPress={refresh} variant="white">
          Try again
        </Button>
      </View>
    );
  }

  // For now, we let other components deal with backend errors
  // if (isBackendUnreachable) {
  //   const prefixedMsg = `Backend: ${backendErrorMsg}`;
  //   return <ErrorState tryAgain={refresh} error={prefixedMsg} />;
  // }

  // Covers "VPN Needed" AND "Bad WiFi"
  return (
    <>
      {children}
      <InformationModal
        img={VpnWarning}
        informationText={
          "اگه این متن رو میفهمی VPN رو روشن کن!\n\n" +
          "We can't connect to the server. If you are online, please try enabling your VPN."
        }
        modalVisible={warningVisible}
        setModalVisible={setWarningVisible}
      >
        <View className="flex flex-row items-center gap-4">
          <Button
            onPress={() => {
              setWarningVisible(false);
            }}
            variant="white"
            size="md"
            className="w-full"
          >
            Ok, understood.
          </Button>
        </View>
      </InformationModal>
    </>
  );
};
