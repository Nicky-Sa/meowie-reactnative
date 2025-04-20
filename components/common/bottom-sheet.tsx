import React, {
  useRef,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, Platform } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Close from "@/assets/icons/close.svg";
import { Button } from "@/components/common/button";
import { tailwind } from "@/lib/utils";

type Props = {
  title: string;
};

export type ExposedBottomSheetModalRef = {
  present: () => void;
  dismiss: () => void;
};

export const BottomSheet = forwardRef<
  ExposedBottomSheetModalRef,
  PropsWithChildren<Props>
>(({ children, title }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["25%", "50%", "90%"];

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetRef.current?.present();
    },
    dismiss: () => {
      bottomSheetRef.current?.dismiss();
    },
  }));

  return (
    <>
      <BottomSheetModal
        index={Platform.select({ android: 1, ios: 2 })}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animationConfigs={{
          duration: Platform.select({
            android: 400, // Slower animation for Android
            ios: 300, // Default iOS duration
          }),
        }}
        backgroundStyle={{
          backgroundColor: tailwind.theme.backgroundColor.neutral["14"].default,
        }}
        handleIndicatorStyle={{
          backgroundColor: tailwind.theme.backgroundColor.neutral["10"].default,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.8}
            pressBehavior="close"
            enableTouchThrough={false}
            animatedIndex={props.animatedIndex}
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
              onPress={() => bottomSheetRef.current?.dismiss()}
              variant={"secondary"}
              size={"md"}
              square
            >
              <Close />
            </Button>
          </View>

          {children}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});
