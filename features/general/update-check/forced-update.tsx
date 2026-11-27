import { PropsWithChildren } from "react";
import { View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { InformationBlock } from "@/features/common/information-block";
import { UpdateAnimation } from "@/features/general/update-check/update-animation";
import { openAppStore } from "@/features/general/update-check/utils/app-store";
import { useVersionCheck } from "@/features/general/update-check/hooks/use-version-check";

export const ForcedUpdate = ({ children }: PropsWithChildren) => {
  const { updateState } = useVersionCheck();

  // Replaces the app instead of covering it, so no screen keeps sending requests to the backend
  if (updateState !== "required") return children;

  return (
    <View className="flex-1 bg-neutral-15-default">
      <InformationBlock
        img={UpdateAnimation}
        title="Update required"
        text={`This version of Meowie is no longer supported.\nPlease update to benefit from the latest features.`}
      >
        <Button onPress={openAppStore} variant="white">
          Update
        </Button>
      </InformationBlock>
    </View>
  );
};
