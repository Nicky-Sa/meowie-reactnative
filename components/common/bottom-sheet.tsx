import React, {
  useRef,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { View, Text, Platform } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import Close from "@/assets/icons/close.svg";
import { Button } from "@/components/common/button";
import { tailwind } from "@/lib/utils";

type Props = {
  title: string;
  footer?: React.ReactNode;
  enableContentPanningGesture?: boolean;
  index?: number;
  onDismiss?: () => void;
};

export type ExposedBottomSheetModalRef = {
  present: () => void;
  dismiss: () => void;
  snapToIndex: (index: number | "latest") => void;
};

export const BottomSheet = forwardRef<
  ExposedBottomSheetModalRef,
  PropsWithChildren<Props>
>(
  (
    {
      children,
      title,
      footer,
      enableContentPanningGesture = true,
      index = 1,
      onDismiss,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [footerHeight, setFooterHeight] = useState(0);
    const snapPoints = ["35%", "60%", "90%"];

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
      snapToIndex: (index: number | string) => {
        if (typeof index === "number") {
          bottomSheetRef.current?.snapToIndex(index);
        }
        if (index === "latest") {
          bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
        }
      },
    }));

    return (
      <>
        <BottomSheetModal
          index={index}
          ref={bottomSheetRef}
          enablePanDownToClose
          enableDynamicSizing={false}
          enableContentPanningGesture={enableContentPanningGesture}
          snapPoints={snapPoints}
          onDismiss={onDismiss}
          animationConfigs={{
            duration: Platform.select({
              android: 400,
              ios: 300,
            }),
          }}
          backgroundStyle={{
            backgroundColor:
              tailwind.theme.backgroundColor.neutral["14"].default,
          }}
          handleIndicatorStyle={{
            backgroundColor:
              tailwind.theme.backgroundColor.neutral["10"].default,
          }}
          backdropComponent={(props: BottomSheetBackdropProps) => (
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
          footerComponent={(props) => (
            <BottomSheetFooter {...props}>
              <View
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setFooterHeight(height);
                }}
              >
                {footer}
              </View>
            </BottomSheetFooter>
          )}
        >
          <View
            className={"flex flex-1 flex-col bg-neutral-14-default px-4"}
            style={{
              paddingBottom: footerHeight + 16,
            }}
          >
            <View
              className={
                "flex w-full flex-row items-center justify-between pb-4"
              }
            >
              <Text className={"title-t2 text-neutral-10-default"}>
                {title}
              </Text>
              <Button
                onPress={() => bottomSheetRef.current?.dismiss()}
                variant={"secondary"}
                size={"md"}
                square
              >
                <Close />
              </Button>
            </View>
            {/*<BottomSheetScrollView showsVerticalScrollIndicator={false}>*/}
            {children}
            {/*</BottomSheetScrollView>*/}
          </View>
        </BottomSheetModal>
      </>
    );
  },
);

BottomSheet.displayName = "BottomSheet";
