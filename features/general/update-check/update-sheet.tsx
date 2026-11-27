import { View } from "react-native";
import { BottomSheet } from "@/features/common/ui/bottom-sheet";
import { Button } from "@/features/common/ui/button";
import { InformationBlock } from "@/features/common/information-block";
import { UpdateAnimation } from "@/features/general/update-check/update-animation";
import { openAppStore } from "@/features/general/update-check/utils/app-store";
import { useUpdateSheet } from "@/features/general/update-check/hooks/use-update-sheet";

export const UpdateSheet = () => {
  const { sheetRef, close, onDismiss } = useUpdateSheet();

  return (
    <BottomSheet
      ref={sheetRef}
      title="Update available"
      index={0}
      enableDynamicSizing
      onDismiss={onDismiss}
      footer={
        <View className="flex-row gap-4">
          <Button variant="ghost" size="lg" fullWidth onPress={close}>
            Later
          </Button>
          <Button variant="primary" size="lg" fullWidth onPress={openAppStore}>
            Update
          </Button>
        </View>
      }
    >
      <View className="py-6">
        <InformationBlock
          img={UpdateAnimation}
          text={`A new version of Meowie is available.\nUpdate to benefit from the latest features.`}
        />
      </View>
    </BottomSheet>
  );
};
