import { Keyboard, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { PropsWithChildren, useEffect, useState } from "react";
import NoInternet from "@/assets/images/errors/no-internet.svg";
import VpnWarning from "@/assets/images/errors/vpn-warning.svg";
import { InformationModal } from "@/features/common/information-modal";
import { InformationBlock } from "@/features/common/information-block";
import { useConnectionCheck } from "@/hooks/use-connection-check";

export const InternetCheck = ({ children }: PropsWithChildren) => {
  const { isOffline, isRestricted, refresh } = useConnectionCheck();

  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    if (isRestricted) setWarningVisible(true);
  }, [isRestricted]);

  // iOS draws the keyboard above the app, so it would stay up over the offline view.
  useEffect(() => {
    if (isOffline) Keyboard.dismiss();
  }, [isOffline]);

  return (
    <>
      {children}
      {/* Covers the app instead of replacing it, so the open screen is still there when the connection is back. */}
      {isOffline && (
        <View className="absolute inset-0">
          <InformationBlock
            img={NoInternet}
            text="Please check your internet settings."
          >
            <Button onPress={refresh} variant="white">
              Try again
            </Button>
          </InformationBlock>
        </View>
      )}
      {/* Covers "VPN Needed" AND "Bad WiFi" */}
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
