import { PropsWithChildren } from "react";
import { View } from "react-native";
import CoolMeowie from "@/assets/images/meowie/cool-meowie.svg";
import { Button } from "@/features/common/ui/button";
import { InformationBlock } from "@/features/common/information-block";
import { openAppStore } from "@/features/general/update-check/utils/app-store";
import { useVersionCheck } from "@/features/general/update-check/hooks/use-version-check";

export const ForcedUpdate = ({ children }: PropsWithChildren) => {
  const { updateState } = useVersionCheck();

  return (
    <>
      {children}
      {updateState === "required" && (
        <View className="absolute inset-0">
          <InformationBlock
            img={CoolMeowie}
            text="This version of Meowie is no longer supported. Please update to benefit from the latest features."
          >
            <Button onPress={openAppStore} variant="white">
              Update
            </Button>
          </InformationBlock>
        </View>
      )}
    </>
  );
};
