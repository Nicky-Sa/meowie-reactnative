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

type Props = {
  title: string;
  filterKey: keyof Filters;
  currentValues: string[];
};

export const FilterItemWrapper = ({
  title,
  filterKey,
  currentValues,
  children,
}: PropsWithChildren<Props>) => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const insets = useSafeAreaInsets();
  const [, setFilters] = useAtom(filtersAtom);

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
          <AltArrowRight />
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
      >
        {children}
      </BottomSheet>
    </>
  );
};
