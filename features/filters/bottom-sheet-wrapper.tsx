import { ReactNode, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { Updater, useImmer } from "use-immer";
import { Chip } from "@/features/common/ui/chip";
import { Action } from "@/features/common/ui/action";
import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { NavArrowRight, Xmark } from "iconoir-react-native";

type Props<TValue> = {
  title: string;
  chipText: string;
  enableContentPanningGesture?: boolean;
  index?: number;

  // Controlled Data
  value: TValue;
  isClearable: boolean;
  onApply: (updatedValue: TValue) => void;
  onClear: () => void;

  children: (props: {
    currentValues: TValue;
    setCurrentValues: Updater<TValue>;
  }) => ReactNode;
};

export const BottomSheetWrapper = <TValue,>({
  title,
  chipText,
  enableContentPanningGesture,
  index,
  value,
  isClearable,
  onApply,
  onClear,
  children,
}: Props<TValue>) => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  // Local draft values for editing inside the BottomSheet
  const [draftCurrentValues, setDraftCurrentValues] = useImmer<TValue>(value);

  // Sync draft with fresh value whenever it opens or changes externally
  useEffect(() => {
    setDraftCurrentValues(value);
  }, [value, setDraftCurrentValues]);

  const isApplyingRef = useRef(false);

  return (
    <>
      <Action onPress={() => bottomSheetRef.current?.present()}>
        <View className="flex w-full flex-row items-center justify-between">
          <Text className="body-b1-strong text-neutral-10-default">
            {title}
          </Text>

          {isClearable ? (
            <View className="flex flex-row items-center justify-center">
              <Chip text={chipText} />
              <Button
                variant="link"
                iconOnly
                onPress={onClear}
                className="ml-2"
              >
                <Icon i={Xmark} />
              </Button>
            </View>
          ) : (
            <View className="flex flex-row">
              {/* Empty chip for consistent layout height */}
              <View className="invisible">
                <Chip text="0" />
              </View>
              <Icon i={NavArrowRight} />
            </View>
          )}
        </View>
      </Action>

      <BottomSheet
        ref={bottomSheetRef}
        title={title}
        footer={
          <Button
            variant="white"
            size="lg"
            onPress={() => {
              isApplyingRef.current = true;
              onApply(draftCurrentValues);
              bottomSheetRef.current?.dismiss();
            }}
          >
            Apply
          </Button>
        }
        enableContentPanningGesture={enableContentPanningGesture}
        index={index}
        onDismiss={() => {
          if (isApplyingRef.current) {
            isApplyingRef.current = false;
            return;
          }
          setDraftCurrentValues(value);
        }}
      >
        {/* Pass local state to children */}
        {children({
          currentValues: draftCurrentValues,
          setCurrentValues: setDraftCurrentValues,
        })}
      </BottomSheet>
    </>
  );
};
