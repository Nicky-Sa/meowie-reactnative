import { Button } from "@/features/common/ui/button";
import { Emitter } from "@/features/common/event-emitting/emitter";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";
import CryingMeowie from "@/assets/images/crying-meowie.svg";
import { useLogout } from "@/features/general/data/useLogout";
import { useRevalidateAuth } from "@/features/general/data/useRevalidateAuth";
import { useRouter } from "expo-router";

export const Logout = () => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const { trigger: triggerLogout } = useLogout();
  const { revalidate } = useRevalidateAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await triggerLogout();
    Emitter.emit("clearTokens");
    await revalidate();
    bottomSheetRef.current?.dismiss();
    router.replace("/movies");
  };

  return (
    <>
      <Button
        variant={"ghost"}
        size={"lg"}
        onPress={() => bottomSheetRef.current?.present()}
      >
        Logout
      </Button>
      <BottomSheet
        ref={bottomSheetRef}
        title={"Logout"}
        index={0}
        footer={
          <View className={"flex flex-row gap-4"}>
            <Button
              variant="black"
              size="lg"
              className="flex-1"
              onPress={() => {
                bottomSheetRef.current?.dismiss();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="white"
              size="lg"
              className="flex-1"
              onPress={handleLogout}
            >
              Logout
            </Button>
          </View>
        }
      >
        <View className={"flex flex-col items-center gap-4"}>
          <CryingMeowie />
          <Text className={"body-b1 text-center text-neutral-10-default"}>
            Are you sure you want to logout?
          </Text>
        </View>
      </BottomSheet>
    </>
  );
};
