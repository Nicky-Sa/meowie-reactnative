import { Text, View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { NavArrowRight, Xmark } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { ReactNode, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
  Filters,
  initialFiltersValue,
} from "@/features/common/data/media-query";
import { Updater, useImmer } from "use-immer";
import { Chip } from "@/features/common/ui/chip";
import _ from "lodash";
import { Action } from "@/features/common/ui/action";
import { Icon } from "@/features/common/ui/icon";
import { filtersAtom } from "@/atoms";

type Props<T extends keyof Filters> = {
  title: string;
  filterKey: T;
  chipText: string;
  enableContentPanningGesture?: boolean;
  index?: number;
  children: (props: {
    currentValues: Filters[T];
    setCurrentValues: Updater<Filters[T]>;
  }) => ReactNode;
};

export const BottomSheetWrapper = <T extends keyof Filters>({
  title,
  filterKey,
  chipText,
  enableContentPanningGesture,
  index,
  children,
}: Props<T>) => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const [filters, setFilters] = useAtom(filtersAtom);

  // Local draft values for editing inside the BottomSheet
  const [draftCurrentValues, setDraftCurrentValues] = useImmer(
    filters[filterKey],
  );

  // Sync draft with atom whenever the BottomSheet opens or filters change externally
  useEffect(() => {
    setDraftCurrentValues(filters[filterKey]);
  }, [filters, filterKey, setDraftCurrentValues]);

  const isApplyingRef = useRef(false);

  return (
    <>
      <Action onPress={() => bottomSheetRef.current?.present()}>
        <View className="flex w-full flex-row items-center justify-between">
          <Text className="body-b1-strong text-neutral-10-default">
            {title}
          </Text>

          {!_.isEqual(filters[filterKey], initialFiltersValue[filterKey]) ? (
            <View className="flex flex-row items-center justify-center">
              <Chip text={chipText} />
              <Button
                variant="link"
                iconOnly
                onPress={() => {
                  setFilters((draft) => {
                    draft[filterKey] = initialFiltersValue[filterKey];
                  });
                }}
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
              // Commit local draft to filtersAtom
              setFilters((draft) => {
                draft[filterKey] = draftCurrentValues;
              });
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
          // Reset draft if user closes the BottomSheet without applying
          setDraftCurrentValues(filters[filterKey]);
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
