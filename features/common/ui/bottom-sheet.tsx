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
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { tailwind, cn } from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollOnlyWhenNeeded } from "@/features/common/hooks/use-scroll-only-when-needed";

type Props = {
  title?: string;
  footer?: ReactNode;
  enableContentPanningGesture?: boolean;
  /** false keeps the sheet open on a swipe down or a tap outside, so only its own buttons close it */
  canClose?: boolean;
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
      canClose = true,
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
                // Phones with a home button have no bottom inset, so the footer keeps its own 16 points there
                paddingBottom:
                  Math.max(insets.bottom, Number(tailwind.theme.spacing["4"])) +
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
          // The library reads the whole sheet as one element by default, so VoiceOver and the end-to-end tests can't reach its buttons
          accessible={false}
          enablePanDownToClose={canClose}
          // A handle invites a swipe down, which does nothing when the sheet can't close
          handleComponent={canClose ? undefined : null}
          enableDynamicSizing={enableDynamicSizing}
          // Stops a sheet taller than the screen below the status bar, and its content scrolls instead
          topInset={insets.top}
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
              pressBehavior={canClose ? "close" : "none"}
              enableTouchThrough={false}
              animatedIndex={props.animatedIndex}
              style={{
                backgroundColor:
                  tailwind.theme.backgroundColor.neutral["10"].default,
                borderRadius: Number(tailwind.theme.borderRadius.xl),
              }}
            />
          )}
          // The footer stays fixed at the bottom, so its buttons show even while the content scrolls
          footerComponent={renderFooter}
        >
          <BottomSheetInner
            title={title}
            footerHeight={footerHeight}
            enableDynamicSizing={enableDynamicSizing}
            canClose={canClose}
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
  title?: string;
  children: ReactNode;
  footerHeight: number;
  enableDynamicSizing: boolean;
  canClose: boolean;
};

const BottomSheetInner = ({
  title,
  children,
  footerHeight,
  enableDynamicSizing,
  canClose,
}: BottomSheetInnerProps) => {
  const { scrollEnabled, onLayout, onContentSizeChange } =
    useScrollOnlyWhenNeeded();

  const content = (
    <View
      className={cn(
        "flex flex-col px-4",
        !enableDynamicSizing && "flex-1",
        // Stands in for the space the handle takes when it's hidden
        !canClose && "pt-4",
      )}
      style={
        // When NOT using dynamic sizing, we need paddingBottom to
        // prevent content from hiding behind the absolutely-positioned footer
        !enableDynamicSizing ? { paddingBottom: footerHeight + 16 } : undefined
      }
    >
      {title && (
        <View className="flex w-full flex-row items-center justify-between pb-4">
          <Text className="title-t2 text-neutral-10-default">{title}</Text>
        </View>
      )}
      {children}
    </View>
  );

  return enableDynamicSizing ? (
    // Adds the footer's height below the content, so the sheet sizes to both
    <BottomSheetScrollView
      enableFooterMarginAdjustment
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
    >
      {content}
    </BottomSheetScrollView>
  ) : (
    content
  );
};
