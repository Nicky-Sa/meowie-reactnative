import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Rive, { Alignment } from "rive-react-native";
import Filter from "@/assets/icons/filter.svg";
import { useRouter } from "expo-router";
import { Button } from "@/components/common/button";

export const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className={
        "absolute z-10 flex w-full flex-1 flex-row items-start justify-between px-4"
      }
      style={{
        marginTop: insets.top,
        height: insets.top + 28,
      }}
    >
      <View className={"-mt-1 w-[144px]"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-logo.riv"
          alignment={Alignment.TopLeft}
        />
      </View>
      <Button
        onPress={() => router.push("/filters")}
        variant={"secondary"}
        size={"md"}
        square
      >
        <Filter />
      </Button>
    </View>
  );
};
