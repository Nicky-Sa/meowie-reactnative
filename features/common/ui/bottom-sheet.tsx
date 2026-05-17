import {
  useRef,
  useCallback,
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
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { tailwind, cn } from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      index,
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

    // Stable footer callback to avoid re-creating the component on each render
    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
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
      ),
      [footer, insets.bottom],
    );

    return (
      <>
        <BottomSheetModal
          index={index}
          ref={bottomSheetRef}
          enablePanDownToClose
          enableDynamicSizing={enableDynamicSizing}
          maxDynamicContentSize={maxDynamicContentSize}
          enableContentPanningGesture={enableContentPanningGesture}
          snapPoints={enableDynamicSizing ? undefined : snapPoints}
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
          // When dynamic sizing is enabled, we render the footer INSIDE
          // the content (BottomSheetView) so the library measures
          // content + footer in a single synchronous pass.
          // When dynamic sizing is disabled, we use footerComponent
          // since snap points determine the height, not content measurement.
          footerComponent={enableDynamicSizing ? undefined : renderFooter}
        >
          <BottomSheetInner
            title={title}
            footer={enableDynamicSizing ? footer : undefined}
            footerHeight={footerHeight}
            enableDynamicSizing={enableDynamicSizing}
            insets={insets}
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
  footer?: ReactNode;
  footerHeight: number;
  enableDynamicSizing: boolean;
  insets: { bottom: number };
};

const BottomSheetInner = ({
  title,
  children,
  footer,
  footerHeight,
  enableDynamicSizing,
  insets,
}: BottomSheetInnerProps) => {
  const Container = enableDynamicSizing ? BottomSheetView : View;

  return (
    <Container
      className={cn(
        "flex flex-col bg-neutral-15-default px-4",
        !enableDynamicSizing && "flex-1",
      )}
      style={
        // When NOT using dynamic sizing, we need paddingBottom to
        // prevent content from hiding behind the absolutely-positioned footer
        !enableDynamicSizing ? { paddingBottom: footerHeight + 16 } : undefined
      }
    >
      <View className="flex w-full flex-row items-center justify-between pb-4">
        <Text className="title-t2 text-neutral-10-default">{title}</Text>
      </View>
      {children}
      {/* When dynamic sizing is enabled, render footer inline so the
          library measures everything in one pass — no async onLayout race */}
      {enableDynamicSizing && footer && (
        <View
          className="w-full pt-4"
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
      )}
    </Container>
  );
};
