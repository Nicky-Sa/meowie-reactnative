import { PropsWithChildren } from "react";
import { View } from "react-native";
import CoolMeowie from "@/assets/images/meowie/cool-meowie.svg";
import { Button } from "@/features/common/ui/button";
import { InformationBlock } from "@/features/common/information-block";
import { openAppStore } from "@/features/general/update-check/utils/app-store";
import { useVersionCheck } from "@/features/general/update-check/hooks/use-version-check";

export const ForcedUpdate = ({ children }: PropsWithChildren) => {
  const { updateState } = useVersionCheck();

  // Replaces the app instead of covering it, so no screen keeps sending requests to the backend
  if (updateState !== "required") return children;

  return (
    <View className="flex-1 bg-neutral-15-default">
      <InformationBlock
        img={CoolMeowie}
        text="This version of Meowie is no longer supported. Please update to benefit from the latest features."
      >
        <Button onPress={openAppStore} variant="white">
          Update
        </Button>
      </InformationBlock>
    </View>
  );
};
