import { MainScreen } from "@/features/common/layout/main-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { SearchTrigger } from "@/features/explore/search-trigger";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Filter } from "iconoir-react-native";
import { useRouter } from "expo-router";

export const Screen = () => {
  const router = useRouter();
  return (
    <MainScreen>
      <SafeAreaView
        className={"flex flex-1 flex-col justify-between px-4 pt-2"}
        edges={["top", "left", "right"]}
      >
        <View
          className={"flex w-full flex-row items-center justify-between gap-2"}
        >
          <View className={"flex-grow"}>
            <SearchTrigger />
          </View>
          <Button
            onPress={() => router.push("/filters")}
            variant={"ghost"}
            size={"md"}
            iconOnly
          >
            <Icon i={Filter} />
          </Button>
        </View>
      </SafeAreaView>
    </MainScreen>
  );
};
