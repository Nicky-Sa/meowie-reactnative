import {
  useRef,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useState,
  ReactNode,
} from "react";
import { View, Text, Platform } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Button } from "@/features/common/ui/button";
import { tailwind, cn } from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Xmark } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";

type Props = {
  title: string;
  footer?: ReactNode;
  enableContentPanningGesture?: boolean;
  enableDynamicSizing?: boolean;
  maxDynamicContentSize?: number;
  index?: number;
  onDismiss?: () => void;
  snapPoints?: string[];
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
      enableDynamicSizing = false,
      maxDynamicContentSize,
      index = 1,
      onDismiss,
      snapPoints = ["42%", "60%", "90%"],
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [footerHeight, setFooterHeight] = useState(0);
    const insets = useSafeAreaInsets();

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
          enableDynamicSizing={enableDynamicSizing}
          maxDynamicContentSize={maxDynamicContentSize}
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
              tailwind.theme.backgroundColor.neutral["15"].default,
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
                <View
                  className="w-full bg-neutral-15-default p-4"
                  style={{
                    paddingBottom:
                      insets.bottom +
                      Platform.select({
                        android: Number(tailwind.theme.spacing["2"]),
                        default: 0,
                      }),
                  }}
                >
                  {footer}
                </View>
              </View>
            </BottomSheetFooter>
          )}
        >
          <BottomSheetInner
            title={title}
            footerHeight={footerHeight}
            enableDynamicSizing={enableDynamicSizing}
            onDismiss={() => bottomSheetRef.current?.dismiss()}
          >
            {children}
          </BottomSheetInner>
        </BottomSheetModal>
      </>
    );
  },
);

BottomSheet.displayName = "BottomSheet";

type BottomSheetInnerProps = {
  title: string;
  children: ReactNode;
  footerHeight: number;
  enableDynamicSizing: boolean;
  onDismiss: () => void;
};

const BottomSheetInner = ({
  title,
  children,
  footerHeight,
  enableDynamicSizing,
  onDismiss,
}: BottomSheetInnerProps) => {
  const Container = enableDynamicSizing ? BottomSheetView : View;

  return (
    <Container
      className={cn(
        "flex flex-col bg-neutral-15-default px-4",
        !enableDynamicSizing && "flex-1",
      )}
      style={{
        paddingBottom: footerHeight + 16,
      }}
    >
      <View className="flex w-full flex-row items-center justify-between pb-4">
        <Text className="title-t2 text-neutral-10-default">{title}</Text>
        <Button
          onPress={onDismiss}
          variant="ghost"
          size="md"
          iconPosition="only"
          icon={<Icon i={Xmark} />}
        />
      </View>
      {children}
    </Container>
  );
};
