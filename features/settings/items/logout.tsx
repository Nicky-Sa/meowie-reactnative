import { Button } from "@/features/common/ui/button";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";
import CryingMeowie from "@/assets/images/profile/crying-meowie.svg";
import { useLogout } from "@/features/general/data/useLogout";
import { useRouter } from "expo-router";

export const Logout = () => {
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const { trigger: triggerLogout } = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await triggerLogout();
    bottomSheetRef.current?.dismiss();
    router.replace("/home");
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
