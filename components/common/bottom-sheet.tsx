import React, { useRef, useCallback, PropsWithChildren } from "react";
import { View, Text } from "react-native";
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Close from "@/assets/icons/close.svg";
import { Button } from "@/components/common/button";
import { tailwind } from "@/lib/utils";

type Props = {
  title: string;
};

export const BottomSheet = ({ children, title }: PropsWithChildren<Props>) => {
  // ref
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const snapPoints = ["25%", "50%", "90%"];

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // renders
  return (
    <View className={"flex-1"}>
      <Button onPress={handleOpen}>Open Bottom Sheet</Button>
      <GorhomBottomSheet
        index={-1}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: tailwind.theme.backgroundColor.neutral["14"].default,
        }}
        handleIndicatorStyle={{
          backgroundColor: tailwind.theme.backgroundColor.neutral["10"].default,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={1}
            opacity={0.8}
            style={{
              backgroundColor:
                tailwind.theme.backgroundColor.neutral["10"].default,
              borderRadius: Number(tailwind.theme.borderRadius.xl),
            }}
          />
        )}
      >
        <BottomSheetView
          className={"flex flex-1 flex-col bg-neutral-14-default p-4"}
        >
          <View className={"flex w-full flex-row items-center justify-between"}>
            <Text className={"title-t2 text-neutral-10-default"}>{title}</Text>
            <Button
              onPress={handleClose}
              variant={"secondary"}
              size={"md"}
              square
            >
              <Close />
            </Button>
          </View>

          {children}
        </BottomSheetView>
      </GorhomBottomSheet>
    </View>
  );
};
