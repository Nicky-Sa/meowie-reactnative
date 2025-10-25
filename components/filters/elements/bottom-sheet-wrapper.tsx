import { Text, View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/components/common/bottom-sheet";
import AltArrowRight from "@/assets/icons/alt-arrow-right.svg";
import { Button } from "@/components/common/button";
import { ReactNode, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { Filters, filtersAtom, initialFiltersValue } from "@/atoms";
import { Updater, useImmer } from "use-immer";
import Close from "@/assets/icons/close.svg";
import { Chip } from "@/components/common/chip";
import _ from "lodash";

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

  return (
    <>
      <Button
        onPress={() => bottomSheetRef.current?.present()}
        variant={"secondary"}
        size={"full"}
      >
        <View className="flex w-full flex-row items-center justify-between">
          <Text className="body-b1-strong text-neutral-10-default">
            {title}
          </Text>

          {!_.isEqual(filters[filterKey], initialFiltersValue[filterKey]) ? (
            <View className="flex flex-row items-center justify-center">
              <Chip text={chipText} />
              <Button
                variant="ghost"
                size="unset"
                onPress={() => {
                  setFilters((draft) => {
                    draft[filterKey] = initialFiltersValue[filterKey];
                  });
                }}
                style={{
                  borderWidth: 0,
                  paddingLeft: 8,
                }}
              >
                <Close />
              </Button>
            </View>
          ) : (
            <View className="flex flex-row">
              {/* Empty chip for consistent layout height */}
              <View className="invisible">
                <Chip text="0" />
              </View>
              <AltArrowRight color={"#FAFAFA"} />
            </View>
          )}
        </View>
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        title={title}
        footer={
          <Button
            variant="primary"
            size="full"
            className="text-center"
            onPress={() => {
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
