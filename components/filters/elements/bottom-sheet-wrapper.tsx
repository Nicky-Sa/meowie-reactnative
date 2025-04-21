import { Text, View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/components/common/bottom-sheet";
import AltArrowRight from "@/assets/icons/alt-arrow-right.svg";
import { Button } from "@/components/common/button";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom } from "jotai/index";
import { Filters, filtersAtom } from "@/atoms";
import { Updater } from "use-immer";
import Close from "@/assets/icons/close.svg";
import Chip from "@/components/common/chip";

type Props = {
  title: string;
  filterKey: keyof Filters;
  currentValues: string[];
  setCurrentValues: Updater<string[]>;
};

export const BottomSheetWrapper = ({
  title,
  filterKey,
  currentValues,
  setCurrentValues,
  children,
}: PropsWithChildren<Props>) => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useAtom(filtersAtom);

  useEffect(() => {
    setCurrentValues(filters[filterKey]);
  }, [filters]);

  return (
    <>
      <Button
        onPress={() => bottomSheetRef.current?.present()}
        variant={"secondary"}
        size={"full"}
      >
        <View className={"flex w-full flex-row items-center justify-between"}>
          <Text className={"body-b1-strong text-neutral-10-default"}>
            {title}
          </Text>
          {filters[filterKey].length > 0 ? (
            <View className={"flex flex-row items-center justify-center"}>
              <Chip
                text={
                  filters[filterKey].length === 1
                    ? filters[filterKey][0]
                    : `${filters[filterKey].length}`
                }
              />
              <Button
                variant={"ghost"}
                size={"unset"}
                onPress={() => {
                  setFilters((draft) => {
                    draft[filterKey] = [];
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
            <View className={"flex flex-row"}>
              {/*The chip is here to preserve the same height as the other button*/}
              <View className={"invisible"}>
                <Chip text={"0"} />
              </View>
              <AltArrowRight />
            </View>
          )}
        </View>
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        title={title}
        footer={
          <View
            className={"w-full bg-neutral-14-default p-4"}
            style={{
              paddingBottom: insets.bottom,
            }}
          >
            <Button
              variant={"primary"}
              size={"full"}
              className={"text-center"}
              onPress={() => {
                setFilters((draft) => {
                  draft[filterKey] = currentValues;
                });
                bottomSheetRef.current?.dismiss();
              }}
            >
              Apply
            </Button>
          </View>
        }
        onDismiss={() => {
          // rest the current values to the previous values if not applied
          setCurrentValues(filters[filterKey]);
        }}
      >
        {children}
      </BottomSheet>
    </>
  );
};
