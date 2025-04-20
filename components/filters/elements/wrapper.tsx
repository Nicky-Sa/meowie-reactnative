import { Text, View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/components/common/bottom-sheet";
import AltArrowRight from "@/assets/icons/alt-arrow-right.svg";
import { Button } from "@/components/common/button";
import { PropsWithChildren, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  title: string;
};

export const FilterItemWrapper = ({
  title,
  children,
}: PropsWithChildren<Props>) => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

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

      <BottomSheet ref={bottomSheetRef} title={title}>
        {children}
      </BottomSheet>
    </>
  );
};
