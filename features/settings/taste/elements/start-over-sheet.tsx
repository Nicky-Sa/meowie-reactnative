import { forwardRef } from "react";
import { Text } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { Button } from "@/features/common/ui/button";

type Props = {
  onStartOver: () => void;
};

export const StartOverSheet = forwardRef<ExposedBottomSheetModalRef, Props>(
  ({ onStartOver }, ref) => (
    <BottomSheet
      ref={ref}
      title={"Start over?"}
      index={0}
      enableDynamicSizing
      footer={
        <Button variant={"white"} size={"lg"} onPress={onStartOver}>
          Yes, let’s go
        </Button>
      }
    >
      <Text className={"body-b1 text-neutral-8-default"}>
        You can start over with the taste journey and update your preferences.
      </Text>
    </BottomSheet>
  ),
);

StartOverSheet.displayName = "StartOverSheet";
