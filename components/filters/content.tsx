import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "@/components/common/button";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Genres } from "@/components/filters/items/genres";
import { Languages } from "@/components/filters/items/languages";

export const Content = () => {
  const router = useRouter();

  return (
    <View className={"flex-1 bg-neutral-13-default"}>
      <SafeAreaView>
        <View className={"flex h-full flex-col justify-between p-4"}>
          <View
            className={"flex w-full flex-row items-center justify-start gap-3"}
          >
            <Button
              onPress={router.back}
              variant={"secondary"}
              size={"md"}
              square
            >
              <ArrowLeft />
            </Button>
            <Text className={"title-t2-strong text-neutral-10-default"}>
              Filters
            </Text>
          </View>

          <View className={"flex w-full flex-col gap-2"}>
            <Genres />
            <Languages />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
