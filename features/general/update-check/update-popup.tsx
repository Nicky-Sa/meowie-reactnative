import { View } from "react-native";
import { useAtom } from "jotai";
import CoolMeowie from "@/assets/images/meowie/cool-meowie.svg";
import { skippedUpdateVersionAtom } from "@/atoms";
import { Button } from "@/features/common/ui/button";
import { InformationModal } from "@/features/common/information-modal";
import { openAppStore } from "@/features/general/update-check/utils/app-store";
import { useVersionCheck } from "@/features/general/update-check/hooks/use-version-check";

export const UpdatePopup = () => {
  const { updateState, latestVersion } = useVersionCheck();
  const [skippedVersion, setSkippedVersion] = useAtom(skippedUpdateVersionAtom);

  const isVisible =
    updateState === "available" && latestVersion !== skippedVersion;

  // Closing the popup in any way counts as "Later".
  const skipThisVersion = () => setSkippedVersion(latestVersion ?? "");

  return (
    <InformationModal
      img={CoolMeowie}
      informationText="A new version of Meowie is available. Update to benefit from the latest features."
      modalVisible={isVisible}
      setModalVisible={skipThisVersion}
    >
      <View className="flex-1 flex-row gap-4">
        <View className="flex-1">
          <Button onPress={skipThisVersion} variant="black" size="lg">
            Later
          </Button>
        </View>
        <View className="flex-1">
          <Button onPress={openAppStore} variant="white" size="lg">
            Update
          </Button>
        </View>
      </View>
    </InformationModal>
  );
};
